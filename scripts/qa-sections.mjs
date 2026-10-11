// Full-height element screenshots of each section (after triggering in-view animations).
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'
const [out = './qa-out', width = '1440', ids = 'top,work,systems,approach,stack,experience,resume,contact', hash = ''] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const w = Number(width)
const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser', headless: true, args: ['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: w, height: 900, deviceScaleFactor: w < 500 ? 2 : 1, isMobile: w < 500, hasTouch: w < 500 })
await page.goto(`http://localhost:4173/${hash}`, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
// walk the page so whileInView animations fire
const h = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < h; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 120)) }
await new Promise((r) => setTimeout(r, 1200))
for (const id of ids.split(',')) {
  const el = await page.$(`#${id}`)
  if (!el) continue
  await el.screenshot({ path: `${out}/${w}-${id}.png` })
}
await browser.close()
console.log('done')
