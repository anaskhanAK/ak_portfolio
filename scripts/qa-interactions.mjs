// Interaction + accessibility checks against the preview server.
import puppeteer from 'puppeteer-core'
const base = process.argv[2] || 'http://localhost:4173/'
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser', headless: true, args: ['--no-sandbox'] })
const results = []
const check = (name, ok, extra = '') => results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ': ' + extra : ''}`)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const errors = []

const page = await browser.newPage()
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
await page.setViewport({ width: 1280, height: 860 })
await page.goto(base, { waitUntil: 'networkidle0' })

// Structure
const h1 = await page.$$eval('h1', (els) => els.map((e) => e.textContent.trim()))
check('exactly one h1', h1.length === 1, h1.join('|'))
const h2 = await page.$$eval('main h2', (els) => els.map((e) => e.textContent.trim()))
check('section h2s present', h2.length >= 7, `${h2.length}`)
const imgsNoAlt = await page.$$eval('img', (els) => els.filter((e) => !e.hasAttribute('alt')).length)
check('all images have alt', imgsNoAlt === 0)
const unnamed = await page.$$eval('button, a[href]', (els) =>
  els.filter((e) => !(e.getAttribute('aria-label') || e.textContent.trim() || e.getAttribute('title'))).map((e) => e.outerHTML.slice(0, 80)),
)
check('all buttons/links have accessible names', unnamed.length === 0, unnamed.slice(0, 3).join(' '))
check('lang attribute', (await page.$eval('html', (h) => h.lang)) === 'en')

// Keyboard: first Tab lands on skip link
await page.keyboard.press('Tab')
const first = await page.evaluate(() => document.activeElement?.textContent?.trim())
check('first tab = skip link', first === 'Skip to content', first)

// Work filter
const before = await page.$$eval('#work article', (a) => a.length)
await page.evaluate(() => [...document.querySelectorAll('#work [role=tab]')].find((b) => b.textContent.includes('Markets'))?.click())
await sleep(700)
const after = await page.$$eval('#work article', (a) => a.length)
check('work filter narrows featured cards', after < before && after > 0, `${before} → ${after}`)
await page.evaluate(() => [...document.querySelectorAll('#work [role=tab]')].find((b) => b.textContent.startsWith('All'))?.click())
await sleep(500)

// Stack selection
await page.evaluate(() => [...document.querySelectorAll('#stack button[aria-pressed]')].find((b) => b.textContent.startsWith('Selenium'))?.click())
await sleep(500)
const stackTitle = await page.evaluate(() => document.querySelector('#stack [aria-live] .font-display')?.textContent)
const stackCount = await page.evaluate(() => document.querySelectorAll('#stack [aria-live] ul li').length)
check('stack shows Selenium usage', stackTitle === 'Selenium' && stackCount === 3, `${stackTitle} (${stackCount})`)

// Experience role switch
await page.evaluate(() => [...document.querySelectorAll('#experience button[aria-pressed]')].find((b) => b.textContent.trim().endsWith('Full Stack Developer'))?.click())
await sleep(500)
const emptyMsg = await page.evaluate(() => document.querySelector('#experience')?.textContent.includes('No code from this period'))
check('experience: earliest role shows no-code message', emptyMsg)

// Case study open via click, focus, Esc, focus return
await page.evaluate(() => document.getElementById('work')?.scrollIntoView())
await sleep(400)
const scrollBefore = await page.evaluate(() => window.scrollY)
const trigger = await page.$('#work article h3 button')
await trigger.focus()
await page.keyboard.press('Enter')
await sleep(900)
const dialog = await page.$('[role=dialog][aria-modal=true]')
check('case study opens as modal dialog', Boolean(dialog))
check('hash route set', (await page.evaluate(() => location.hash)).startsWith('#/work/'))
const focusInDialog = await page.evaluate(() => Boolean(document.activeElement?.closest('[role=dialog]')))
check('focus moved into dialog', focusInDialog)
const bgInert = await page.evaluate(() => document.querySelector('#main')?.closest('[inert]') !== null)
check('background is inert', bgInert)
// tab trap
for (let i = 0; i < 60; i++) await page.keyboard.press('Tab')
const stillInside = await page.evaluate(() => Boolean(document.activeElement?.closest('[role=dialog]')))
check('Tab stays trapped in dialog', stillInside)
// next via arrow key
const t1 = await page.evaluate(() => document.getElementById('cs-title')?.textContent)
await page.evaluate(() => document.body.focus())
await page.keyboard.press('ArrowRight')
await sleep(900)
const t2 = await page.evaluate(() => document.getElementById('cs-title')?.textContent)
check('ArrowRight moves to next case study', t1 !== t2, `${t1} → ${t2}`)
await page.keyboard.press('Escape')
await sleep(900)
check('Esc closes dialog', !(await page.$('[role=dialog][aria-modal=true]')))
check('hash cleared after close', !(await page.evaluate(() => location.hash)).startsWith('#/work/'))
const scrollAfter = await page.evaluate(() => window.scrollY)
check('scroll position preserved', Math.abs(scrollAfter - scrollBefore) < 40, `${scrollBefore} → ${scrollAfter}`)

// Deep link + browser back
await page.goto(`${base}#/work/support-gpt`, { waitUntil: 'networkidle0' })
await sleep(800)
check('deep link opens case study', (await page.evaluate(() => document.getElementById('cs-title')?.textContent))?.includes('Support'))
await page.click('[role=dialog] button[aria-label="Close case study"]:not([tabindex="-1"])')
await sleep(800)
check('close button closes deep-linked case study', !(await page.$('[role=dialog][aria-modal=true]')))

// Every case study renders
for (const slug of ['nichetrx','support-gpt','card-grading-arbitrage','solana-bot-suite','tradingview-mail-watcher','geo-qa-vision','creator-paywall','ndis-report-generator','crypto-arbitrage-scanner','ig-markets-signals','forex-calendar-etl','wallet-onboarding-api','pga-iso-metrics','people-search-portal','ebook-preview-capture']) {
  await page.goto(`${base}#/work/${slug}`, { waitUntil: 'networkidle0' })
  await sleep(500)
  const ok = await page.evaluate(() => Boolean(document.getElementById('cs-title')?.textContent))
  if (!ok) check(`case study renders: ${slug}`, false)
}
check('all 15 case studies render', !results.some((r) => r.includes('case study renders')))

// Reduced motion
const rm = await browser.newPage()
rm.on('pageerror', (e) => errors.push('[reduced] ' + e.message))
await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await rm.setViewport({ width: 1280, height: 860 })
await rm.goto(base, { waitUntil: 'networkidle0' })
await sleep(2500)
const pauseBtn = await rm.evaluate(() => [...document.querySelectorAll('#systems button')].some((b) => b.textContent.includes('walkthrough')))
check('reduced motion: walkthrough autoplay control hidden', !pauseBtn)
const traceStates = await rm.evaluate(() => [...document.querySelectorAll('#top ol li span.text-ink-4')].length)
check('reduced motion: trace shows all stages (no idle)', traceStates === 0, `${traceStates} idle`)

check('no runtime errors', errors.length === 0, errors.slice(0, 3).join(' | '))
await browser.close()
console.log(results.join('\n'))
