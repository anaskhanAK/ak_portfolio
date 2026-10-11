// Renders public/og-image.png (1200×630) and public/apple-touch-icon.png (180×180) with headless Chromium.
// Usage: CHROME_PATH=/usr/bin/brave-browser node scripts/generate-assets.mjs

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (p) => resolve(root, 'public', p)
const font = (p) => pathToFileURL(resolve(root, 'node_modules', p)).href
const photo = `data:image/webp;base64,${readFileSync(pub('img/anas-640.webp')).toString('base64')}`

const fonts = `
@font-face{font-family:Display;src:url('${font('@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2')}');font-weight:200 800}
@font-face{font-family:Sans;src:url('${font('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}');font-weight:100 900}
@font-face{font-family:Mono;src:url('${font('@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2')}');font-weight:100 800}`

const og = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#f6f5f1;font-family:Sans;color:#0e1217;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgb(14 18 23/.05) 1px,transparent 1px),linear-gradient(to bottom,rgb(14 18 23/.05) 1px,transparent 1px);background-size:32px 32px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 30% 40%,#000,transparent 80%)}
.wrap{position:absolute;inset:0;padding:64px 72px;display:flex;gap:56px}
.left{flex:1;display:flex;flex-direction:column}
.pill{align-self:flex-start;display:flex;gap:10px;align-items:center;border:1px solid #e2dfd7;background:#fff;border-radius:999px;padding:7px 16px 7px 8px;font-size:20px;color:#373d46}
.pill b{font-family:Mono;font-weight:500;font-size:15px;color:#b93d0c;background:#fdebe2;border-radius:999px;padding:4px 10px}
h1{font-family:Display;font-size:116px;line-height:.92;letter-spacing:-.045em;font-weight:620;margin-top:34px}
p{font-family:Display;font-size:34px;line-height:1.2;letter-spacing:-.02em;font-weight:500;margin-top:26px;max-width:620px}
.c1{color:#2c56e0}.c2{color:#087a56}.c3{color:#6d43e6}
.foot{margin-top:auto;font-family:Mono;font-size:18px;color:#5b626c;display:flex;gap:18px}
.right{width:330px;position:relative}
.photo{width:330px;height:420px;border-radius:30px;overflow:hidden;border:1px solid #e2dfd7;box-shadow:0 30px 60px -30px rgb(14 18 23/.45);margin-top:10px}
.photo img{width:100%;height:100%;object-fit:cover;object-position:50% 18%}
.mark{position:absolute;right:-6px;bottom:52px;width:84px;height:84px;border-radius:22px;background:#0e1217;color:#fff;display:grid;place-items:center;font-family:Display;font-weight:650;font-size:34px;letter-spacing:-.03em;box-shadow:0 14px 30px -12px rgb(14 18 23/.6)}
.mark i{position:absolute;right:-5px;bottom:-5px;width:22px;height:22px;border-radius:50%;background:#e8541c;border:4px solid #f6f5f1}
</style></head><body><div class="grid"></div><div class="wrap"><div class="left">
<div class="pill"><b>Now</b>Team Lead, Python &amp; AI · Tassaract</div>
<h1>Anas Khan</h1>
<p>Building <span class="c1">marketplaces</span>, <span class="c2">market bots</span> and <span class="c3">AI pipelines</span> that turn messy input into decisions.</p>
<div class="foot"><span>FastAPI</span><span>·</span><span>OpenAI</span><span>·</span><span>Selenium</span><span>·</span><span>PostgreSQL</span></div>
</div><div class="right"><div class="photo"><img src="${photo}"></div><div class="mark">AK<i></i></div></div></div></body></html>`

const icon = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{margin:0}body{width:180px;height:180px;background:#0e1217;display:grid;place-items:center;position:relative;font-family:Display;color:#fff;font-weight:650;font-size:74px;letter-spacing:-.04em}
i{position:absolute;right:26px;bottom:26px;width:30px;height:30px;border-radius:50%;background:#e8541c}
</style></head><body>AK<i></i></body></html>`

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || '/usr/bin/brave-browser',
  headless: true,
  args: ['--no-sandbox', '--allow-file-access-from-files'],
})
try {
  const page = await browser.newPage()
  for (const [html, out, w, h] of [
    [og, 'og-image.png', 1200, 630],
    [icon, 'apple-touch-icon.png', 180, 180],
  ]) {
    const tmp = resolve(root, `scripts/.tmp-${out}.html`)
    writeFileSync(tmp, html)
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' })
    await page.evaluateHandle('document.fonts.ready')
    await page.screenshot({ path: pub(out), type: 'png' })
    ;(await import('node:fs')).rmSync(tmp)
    console.log(`✓ public/${out}`)
  }
} finally {
  await browser.close()
}
