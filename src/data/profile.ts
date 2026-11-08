// Personal/profile facts. Title, roles, education and certification are read from the resume
// source (src/data/resume.ts), so the site always matches the downloadable resume.
// Social links are intentionally empty: none were present in the source material.
// Add verified URLs here and they will appear in the hero, contact and footer automatically.
import { resume } from './resume'

const [headline, role] = resume.title.split(' · ')
const [education, certification] = resume.education

export const profile = {
  name: resume.name,
  role,
  company: 'Tassaract',
  headline,
  email: 'anaskhankin1999@gmail.com',
  phoneDisplay: '0349-5112722',
  phoneHref: 'tel:+923495112722',
  location: 'Pakistan · PKT (UTC+5)',
  resumePdf: '/Anas_Khan_Resume.pdf',
  links: {
    linkedin: '',
    github: '',
  },
  education: { title: education[0], body: education[1] },
  certification: { title: certification[0], body: certification[1] },
}

export const summary = resume.summary
export const skills = resume.skills.map(([label, list]) => ({ label, list }))

export type Role = {
  id: string
  title: string
  org: string
  start: number
  end: number | 'present'
  bullets: string[]
  focus: string[]
  /** Portfolio projects that use the skills this role covers (`via` names the shared skill). */
  related: { slug: string; via: string }[]
}

// Portfolio-only extras for each resume role, in resume order (newest first).
// `related`: each project appears under exactly one role, and only where it is plausible for that era:
// its tech existed then (GPT-3.5 fine-tuning from Aug 2023, Jupiter/Birdeye and Bright Data from 2023)
// and it fits the seniority. No crypto or LLM work before the Full Stack ML Engineer role.
const roleExtras = [
  {
    id: 'lead',
    focus: ['Team leadership', 'Agentic AI', 'LangGraph', 'Python', 'Bots & automation'],
    related: [
      { slug: 'researchcrew', via: 'Multi-agent workflow built with LangGraph' },
      { slug: 'web3-trading-agent', via: 'Multi-agent AI with tool calling and Web3' },
      { slug: 'career-metro-map', via: 'LLM feature inside a business application' },
      { slug: 'nichetrx', via: 'Full stack Python platform, end to end' },
      { slug: 'creator-paywall', via: 'Python backend with computer vision' },
      { slug: 'solana-bot-suite', via: 'Arbitrage bots on live prices' },
      { slug: 'tradingview-mail-watcher', via: 'Workflow automation bot' },
      { slug: 'geo-qa-vision', via: 'Scraping and automation at scale' },
      { slug: 'wallet-onboarding-api', via: 'Secure auth and wallet onboarding API' },
    ],
  },
  {
    id: 'ml',
    focus: ['Flask / Django', 'FastAPI', 'Scraping', 'Bots', 'OpenAI API', 'Machine learning'],
    related: [
      { slug: 'support-gpt', via: 'OpenAI-powered support chatbot' },
      { slug: 'ndis-report-generator', via: 'OpenAI inside a business application' },
      { slug: 'card-grading-arbitrage', via: 'ML project from data analysis to a deployed model' },
      { slug: 'crypto-arbitrage-scanner', via: 'Arbitrage bot tracking prices across exchanges' },
      { slug: 'pga-iso-metrics', via: 'Flask API with a background analysis job' },
    ],
  },
  {
    id: 'fsd',
    focus: ['Python', 'Flask / Django', 'React', 'Automation'],
    related: [
      { slug: 'ig-markets-signals', via: 'Flask web application' },
      { slug: 'people-search-portal', via: 'Front-end pages in HTML, CSS and JavaScript' },
      { slug: 'forex-calendar-etl', via: 'Scraping script that collects and stores data' },
      { slug: 'ebook-preview-capture', via: 'Browser automation bot' },
    ],
  },
]

export const roles: Role[] = resume.experience.map((e, i) => {
  const [start, end] = e.dates.split(' - ')
  return {
    ...roleExtras[i],
    title: e.title,
    org: e.org,
    start: Number(start),
    end: end === 'Present' ? 'present' : Number(end),
    bullets: e.bullets,
  }
})
