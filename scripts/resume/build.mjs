// Builds the updated resume as PDF (headless Chromium) and DOCX from content.mjs.
// Usage: CHROME_PATH=/usr/bin/brave-browser node scripts/resume/build.mjs
// Fails if the PDF exceeds two pages.

import { mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import puppeteer from 'puppeteer-core'
import {
  AlignmentType,
  BorderStyle,
  Document,
  LevelFormat,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx'
import { resume } from './content.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const outDir = resolve(root, '../resume')
const publicDir = resolve(root, 'public')
const BASENAME = 'resume_anas_khan_AI_Fullstack_2pgs'
const MAX_PAGES = 2

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fontUrl = (rel) => pathToFileURL(resolve(root, 'node_modules', rel)).href

/* ───────────────────────────── HTML / PDF ───────────────────────────── */

function html(r) {
  const section = (title, body) => `<section><h2>${title}</h2>${body}</section>`
  const bullets = (items) => `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(r.name)} Resume</title>
<style>
${[400, 500, 600, 700].map((w) => `@font-face{font-family:'InterR';src:url('${fontUrl(`@fontsource/inter/files/inter-latin-${w}-normal.woff2`)}') format('woff2');font-weight:${w};font-style:normal}`).join('\n')}
@font-face{font-family:'InterR';src:url('${fontUrl('@fontsource/inter/files/inter-latin-400-italic.woff2')}') format('woff2');font-weight:400;font-style:italic}
@page{size:A4;margin:13mm 14mm 12mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font-family:'InterR',Arial,sans-serif;font-size:9.15pt;line-height:1.38;color:#1c2128;font-feature-settings:'cv11','ss03'}
header{border-bottom:1.2pt solid #0e1217;padding-bottom:7pt;margin-bottom:8pt}
h1{font-size:21pt;line-height:1;margin:0;letter-spacing:-0.02em;font-weight:700;color:#0e1217}
.title{margin-top:4pt;font-size:9.6pt;font-weight:600;color:#b93d0c;letter-spacing:0.01em}
.contact{margin-top:3pt;font-size:8.9pt;color:#373d46}
.contact span+span::before{content:'|';margin:0 6pt;color:#9aa0a8}
section{margin-top:8pt}
h2{font-size:9.2pt;font-weight:700;letter-spacing:0;text-transform:uppercase;color:#0e1217;margin:0 0 4pt;padding-bottom:2pt;border-bottom:0.6pt solid #cdc9bf}
p{margin:0}
.skill{padding-left:10pt;text-indent:-10pt;margin:1.4pt 0}
.skill strong{font-weight:600;color:#0e1217}
.role{margin-top:5.5pt;break-inside:avoid}
.role:first-of-type{margin-top:0}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:12pt}
.row strong{font-size:9.8pt;color:#0e1217}
.org{color:#373d46;font-weight:500}
.dates{font-weight:600;color:#373d46;white-space:nowrap}
.stack{font-size:8.5pt;color:#5b626c;font-style:italic;margin-top:0.5pt}
ul{margin:2.5pt 0 0;padding-left:11pt}
li{margin:1.2pt 0;padding-left:1pt}
li::marker{color:#8a9099}
.also{margin-top:6pt}
.also strong{color:#0e1217}
.edu .row+.row{margin-top:2pt}
</style></head><body>
<header>
  <h1>${esc(r.name)}</h1>
  <div class="title">${esc(r.title)}</div>
  <div class="contact">${r.contact.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
</header>
${section('Summary', `<p>${esc(r.summary)}</p>`)}
${section('Technical Skills', r.skills.map(([k, v]) => `<p class="skill"><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join(''))}
${section(
  'Professional Experience',
  r.experience
    .map(
      (e) => `<div class="role"><div class="row"><span><strong>${esc(e.title)}</strong> <span class="org">· ${esc(e.org)}</span></span><span class="dates">${esc(e.dates)}</span></div>${bullets(e.bullets)}</div>`,
    )
    .join(''),
)}
${section(
  'Selected Projects',
  r.projects
    .map(
      (p) => `<div class="role"><div class="row"><span><strong>${esc(p.name)}</strong>${p.context ? ` <span class="org">· ${esc(p.context)}</span>` : ''}</span></div><div class="stack">${esc(p.stack)}</div>${bullets(p.bullets)}</div>`,
    )
    .join('') + `<p class="also"><strong>Also built:</strong> ${esc(r.alsoBuilt)}</p>`,
)}
${section(
  'Education & Certification',
  `<div class="edu">${r.education.map(([a, b]) => `<div class="row"><span><strong>${esc(a)}</strong> <span class="org">· ${esc(b)}</span></span></div>`).join('')}</div>`,
)}
</body></html>`
}

async function buildPdf(r) {
  const executablePath = process.env.CHROME_PATH || '/usr/bin/brave-browser'
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-gpu'] })
  try {
    const page = await browser.newPage()
    const source = html(r)
    const buildDir = resolve(outDir, '.build')
    mkdirSync(buildDir, { recursive: true })
    writeFileSync(resolve(buildDir, `${BASENAME}.html`), source)
    await page.goto(pathToFileURL(resolve(buildDir, `${BASENAME}.html`)).href, { waitUntil: 'networkidle0' })
    await page.evaluateHandle('document.fonts.ready')
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true })
    const pages = (Buffer.from(pdf).toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
    return { pdf, pages }
  } finally {
    await browser.close()
  }
}

/* ───────────────────────────── DOCX ───────────────────────────── */

const FONT = 'Calibri'
const INK = '0E1217'
const MUTED = '5B626C'
const ACCENT = 'B93D0C'

function docx(r) {
  const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 19, bold: o.bold, italics: o.italics, color: o.color ?? '1C2128' })
  const heading = (text) =>
    new Paragraph({
      spacing: { before: 170, after: 70 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CDC9BF', space: 2 } },
      children: [run(text.toUpperCase(), { bold: true, size: 18, color: INK })],
    })
  const bullet = (text) =>
    new Paragraph({ numbering: { reference: 'dash', level: 0 }, spacing: { after: 30 }, children: [run(text)] })
  const roleLine = (left, right, sub) =>
    new Paragraph({
      spacing: { before: 110, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: 10466 }],
      keepNext: true,
      children: [
        run(left, { bold: true, size: 20, color: INK }),
        ...(sub ? [run(`  ·  ${sub}`, { color: '373D46' })] : []),
        ...(right ? [new TextRun({ text: `\t${right}`, font: FONT, size: 19, bold: true, color: '373D46' })] : []),
      ],
    })

  const children = [
    new Paragraph({ children: [run(r.name, { bold: true, size: 40, color: INK })] }),
    new Paragraph({ spacing: { before: 40 }, children: [run(r.title, { bold: true, size: 20, color: ACCENT })] }),
    new Paragraph({
      spacing: { before: 30, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 10, color: INK, space: 6 } },
      children: [run(r.contact.join('   |   '), { color: '373D46' })],
    }),
    heading('Summary'),
    new Paragraph({ children: [run(r.summary)] }),
    heading('Technical Skills'),
    ...r.skills.map(
      ([k, v]) => new Paragraph({ spacing: { after: 25 }, children: [run(`${k}: `, { bold: true, color: INK }), run(v)] }),
    ),
    heading('Professional Experience'),
    ...r.experience.flatMap((e) => [roleLine(e.title, e.dates, e.org), ...e.bullets.map(bullet)]),
    heading('Selected Projects'),
    ...r.projects.flatMap((p) => [
      roleLine(p.name, '', p.context),
      new Paragraph({ spacing: { after: 20 }, keepNext: true, children: [run(p.stack, { italics: true, color: MUTED, size: 18 })] }),
      ...p.bullets.map(bullet),
    ]),
    new Paragraph({ spacing: { before: 90 }, children: [run('Also built: ', { bold: true, color: INK }), run(r.alsoBuilt)] }),
    heading('Education & Certification'),
    ...r.education.map(([a, b]) => new Paragraph({ spacing: { after: 30 }, children: [run(a, { bold: true, color: INK }), run(`  ·  ${b}`, { color: '373D46' })] })),
  ]

  return new Document({
    creator: r.name,
    title: `${r.name} Resume`,
    description: r.title,
    styles: { default: { document: { run: { font: FONT, size: 19 } } } },
    numbering: {
      config: [
        {
          reference: 'dash',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 300, hanging: 220 } } } }],
        },
      ],
    },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, bottom: 680, left: 760, right: 680 } } }, children }],
  })
}

/* ───────────────────────────── main ───────────────────────────── */

mkdirSync(outDir, { recursive: true })
const { pdf, pages } = await buildPdf(resume)
if (pages > MAX_PAGES) {
  console.error(`✗ PDF is ${pages} pages; the limit is ${MAX_PAGES}. Trim content.mjs.`)
  process.exit(1)
}
const pdfPath = resolve(outDir, `${BASENAME}.pdf`)
writeFileSync(pdfPath, pdf)
const docxBuf = await Packer.toBuffer(docx(resume))
const docxPath = resolve(outDir, `${BASENAME}.docx`)
writeFileSync(docxPath, docxBuf)
copyFileSync(pdfPath, resolve(publicDir, `${BASENAME}.pdf`))
copyFileSync(docxPath, resolve(publicDir, `${BASENAME}.docx`))
// Page-1 preview for the portfolio (needs poppler's pdftoppm; skipped if unavailable).
try {
  const tmp = resolve(outDir, '.build/preview')
  execFileSync('pdftoppm', ['-f', '1', '-l', '1', '-r', '110', '-png', pdfPath, tmp])
  await sharp(`${tmp}-1.png`).resize(820).webp({ quality: 82 }).toFile(resolve(publicDir, 'img/resume-preview.webp'))
  rmSync(`${tmp}-1.png`)
} catch {
  console.warn('! pdftoppm not available, so the resume preview image was not regenerated')
}
console.log(`✓ ${BASENAME}.pdf (${pages} pages) and .docx written to ${outDir} and public/`)
