// QA harness: screenshots each section at several viewports and reports console errors,
// failed requests and horizontal overflow. Usage: node scripts/qa.mjs <outDir> [baseUrl]
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const out = process.argv[2] || './qa-out'
const base = process.argv[3] || 'http://localhost:4173/'
const only = process.env.ONLY?.split(',')
mkdirSync(out, { recursive: true })

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
].filter((v) => !only || only.includes(v.name))

const sections = ['top', 'work', 'systems', 'approach', 'stack', 'experience', 'resume', 'contact']
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser',
  headless: true,
  args: ['--no-sandbox'],
})
const problems = []

for (const vp of viewports) {
  const page = await browser.newPage()
  await page.setViewport({ deviceScaleFactor: 1, ...vp })
  page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && problems.push(`[${vp.name}] console.${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`[${vp.name}] pageerror: ${e.message}`))
  page.on('requestfailed', (r) => problems.push(`[${vp.name}] requestfailed: ${r.url()} ${r.failure()?.errorText}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`[${vp.name}] HTTP ${r.status()}: ${r.url()}`))

  await page.goto(base, { waitUntil: 'networkidle0' })
  await page.evaluate(() => document.fonts.ready)

  // body clips overflow-x, so also look for elements poking past the viewport outside any scroll container
  const clipped = await page.evaluate(() => {
    const vw = window.innerWidth
    const inScroller = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX
        if (o === 'auto' || o === 'scroll') return true
        if (p.getAttribute('aria-hidden') === 'true') return true
      }
      return false
    }
    return [...document.querySelectorAll('main *, header *')]
      .filter((el) => {
        const r = el.getBoundingClientRect()
        if (el.getAttribute('aria-hidden') === 'true' || getComputedStyle(el).pointerEvents === 'none') return false
        return r.width > 0 && r.right > vw + 1 && !inScroller(el)
      })
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} (right=${Math.round(el.getBoundingClientRect().right)})`)
  })
  if (clipped.length) problems.push(`[${vp.name}] content past viewport: ${clipped.join(' | ')}`)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  if (overflow > 0) {
    const culprits = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 6)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`),
    )
    problems.push(`[${vp.name}] horizontal overflow ${overflow}px: ${culprits.join(' | ')}`)
  }

  for (const id of sections) {
    await page.evaluate((id) => document.getElementById(id)?.scrollIntoView({ block: 'start' }), id)
    await new Promise((r) => setTimeout(r, 900))
    await page.screenshot({ path: `${out}/${vp.name}-${id}.png` })
  }

  // Case study overlay
  await page.goto(`${base}#/work/nichetrx`, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${out}/${vp.name}-case-nichetrx.png` })
  await page.evaluate(() => document.querySelector('[role=dialog] .overflow-y-auto')?.scrollBy(0, 1400))
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `${out}/${vp.name}-case-nichetrx-2.png` })
  await page.close()
}

await browser.close()
console.log(problems.length ? problems.join('\n') : 'No console errors, failed requests or overflow.')
