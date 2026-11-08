// Case studies for the agentic-AI projects on the current resume.
// Unlike the older entries, these are written from the resume's own project descriptions, not from
// a code audit, so they carry no commit dates, repo names, file lists or code excerpts, and every
// number below is one the resume states.
import type { Project } from './projects'

const FROM_RESUME = 'Written from the project description in the resume. No code excerpts or repo details are shown for this one.'

export const agenticProjects: Project[] = [
  {
    slug: 'researchcrew',
    name: 'ResearchCrew: Multi-Agent AI Research Assistant',
    short: 'ResearchCrew',
    domain: 'ai',
    kind: 'AI system · Multi-agent pipeline',
    featured: true,
    tagline: 'Six LangGraph agents that research a topic, write a cited report and check it against its own sources.',
    summary:
      'Takes a topic, searches the web, reads and ranks sources, writes a cited report, verifies every claim against its source and exports the result as a PDF with charts.',
    problem: 'A single LLM pass can produce a fluent report with claims nobody has checked against a source.',
    why: 'A report is only useful if a reader can trust each sentence, or at least knows which ones to double-check.',
    solution:
      'A six-agent LangGraph pipeline where every agent has one job. A fact-checker revises the report against its sources, and each report gets an Evidence Score from 0 to 100 plus a list of claims to double-check.',
    stats: [
      { value: '6', label: 'agents in the LangGraph pipeline' },
      { value: '0–100', label: 'Evidence Score on every report' },
      { value: 'Every', label: 'factual sentence carries a citation' },
      { value: 'PDF', label: 'export with charts' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'Plan and search',
        detail:
          'The Planner turns the topic into focused search queries. The Searcher collects sources and ranks them by credibility and relevance.',
        tech: ['langgraph', 'groq'],
      },
      {
        key: 'understand',
        title: 'Analyze',
        detail: 'The Analyzer extracts the findings from the sources and decides whether another search round is needed.',
        tech: ['langgraph', 'groq'],
      },
      {
        key: 'decide',
        title: 'Write and fact-check',
        detail:
          'The Writer puts a citation on every factual sentence. The Fact-Checker checks each claim against its source and revises the report.',
        tech: ['langgraph', 'groq'],
      },
      {
        key: 'act',
        title: 'Extract numbers and export',
        detail:
          'The Data Extractor keeps only numbers that appear in the source text. The finished report is exported as a PDF with charts.',
        tech: ['viz', 'reportlab'],
      },
      {
        key: 'observe',
        title: 'Score and remember',
        detail:
          'Each report gets an Evidence Score from 0 to 100 and a list of claims to double-check. Reports are kept in a per-user history.',
        tech: ['sqlite', 'streamlit'],
      },
    ],
    how: [
      'You give the Planner a topic, and it writes focused search queries.',
      'The Searcher collects sources and ranks them by credibility and relevance.',
      'The Analyzer extracts findings and decides if another search round is needed.',
      'The Writer drafts the report with a citation on every factual sentence.',
      'The Fact-Checker checks each claim against its source and revises the report.',
      'The Data Extractor keeps only numbers found in the source text, and the report is exported as a PDF with charts.',
    ],
    decisions: [
      {
        title: 'One job per agent',
        body: 'Planning, searching, analysing, writing, fact-checking and number extraction are six separate agents, so each step can be inspected on its own.',
      },
      {
        title: 'Verify before you publish',
        body: 'The Fact-Checker compares each claim with its source and revises the report, and the reader still gets a list of claims worth a second look.',
      },
      {
        title: 'Numbers only from the text',
        body: 'The Data Extractor keeps only numbers that appear in the source text, so charts are not built on figures the model made up.',
      },
    ],
    stack: [
      { tech: 'langgraph', role: 'The six-agent pipeline, including the optional extra search round' },
      { tech: 'groq', role: 'LLM calls for the agents' },
      { tech: 'streamlit', role: 'The app around the agents: accounts, profile photo, history, light/dark mode and an admin panel' },
      { tech: 'viz', role: 'Charts in the exported report' },
      { tech: 'reportlab', role: 'PDF export of the finished report' },
      { tech: 'sqlite', role: 'Per-user report history' },
      { tech: 'python', role: 'Everything, built entirely with free tools' },
    ],
    outcome:
      'A complete research assistant that turns a topic into a cited, fact-checked PDF report, with a score for how well the evidence supports it and a list of claims to check by hand.',
    note: FROM_RESUME,
  },
  {
    slug: 'web3-trading-agent',
    name: 'Web3 Trading Agent',
    short: 'Web3 Agent',
    domain: 'markets',
    alsoIn: ['ai'],
    kind: 'AI system · Multi-agent assistant',
    featured: true,
    tagline: 'Turns plain-language and voice commands into structured blockchain actions across three chains.',
    summary:
      'A multi-agent assistant with specialized agents for buying, selling, transfers and copy trading, plus a live wallet view with balances and a market watchlist.',
    problem: 'Doing anything on-chain means picking the right chain, token and amount, and one wrong detail can send funds to the wrong place.',
    why: 'An assistant that guesses missing details is dangerous with money. One that asks is slower but safe.',
    solution:
      'Intent parsing and validation in front of specialized agents. A request like “Buy 5 USDC, then transfer 0.1” is split into two separate intents, and the agent asks for anything missing, such as the target chain, instead of assuming.',
    stats: [
      { value: '3', label: 'chains: Ethereum, Polygon and Solana' },
      { value: '4', label: 'specialized agents: buy, sell, transfer, copy trade' },
      { value: 'Text + voice', label: 'ways to give a command' },
      { value: '1 → 2', label: 'a compound request split into two intents' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'Command in',
        detail: 'A command arrives as natural language, typed or spoken.',
        tech: ['speech'],
      },
      {
        key: 'understand',
        title: 'Intent parsing',
        detail:
          'The request is turned into structured intents. “Buy 5 USDC, then transfer 0.1” becomes two separate intents.',
        tech: ['multiagent'],
      },
      {
        key: 'decide',
        title: 'Validation',
        detail: 'Missing details, such as the target chain, are asked for instead of assumed.',
        tech: ['multiagent'],
      },
      {
        key: 'act',
        title: 'Specialized agents',
        detail: 'Agents for buying, selling, transfers and copy trading carry out the action through tool calls on Ethereum, Polygon or Solana.',
        tech: ['toolcalling', 'chains'],
      },
      {
        key: 'observe',
        title: 'Wallet and watchlist',
        detail: 'A live wallet view shows balances, and a market watchlist tracks the assets you follow.',
        tech: ['chains'],
      },
    ],
    how: [
      'You type or speak a command.',
      'The assistant splits it into one or more structured intents.',
      'Each intent is validated, and the agent asks about anything missing.',
      'The matching agent (buy, sell, transfer or copy trading) acts on the right chain.',
      'The wallet view and watchlist reflect the result.',
    ],
    decisions: [
      {
        title: 'Ask, don’t assume',
        body: 'When a request leaves out something that matters, such as the chain, the agent asks for it before doing anything.',
      },
      {
        title: 'One request, several intents',
        body: 'Compound requests are split so each step is validated and executed on its own.',
      },
      {
        title: 'Specialists over one big prompt',
        body: 'Buying, selling, transfers and copy trading each get their own agent with its own tools.',
      },
    ],
    stack: [
      { tech: 'multiagent', role: 'Specialized agents for buying, selling, transfers and copy trading' },
      { tech: 'toolcalling', role: 'How agents trigger blockchain actions' },
      { tech: 'speech', role: 'Voice commands' },
      { tech: 'chains', role: 'Ethereum, Polygon and Solana support' },
      { tech: 'python', role: 'Primary language' },
    ],
    outcome:
      'An assistant that handles typed and spoken trading commands across three chains and checks the details with you before it acts.',
    note: FROM_RESUME,
  },
  {
    slug: 'career-metro-map',
    name: 'Career Metro Mapping AI',
    short: 'Career Metro',
    domain: 'ai',
    kind: 'AI app · LLM roadmap generator',
    featured: false,
    tagline: 'Upload a CV and see your possible career paths drawn like a subway map.',
    summary:
      'GPT-4o generates a career roadmap from a CV against a strict JSON schema, and a matching training plan is exported as a PDF.',
    problem: 'A CV lists where someone has been, but not the routes open to them from there.',
    why: 'Career advice is easier to act on when the paths, the branches and the next steps are visible in one picture.',
    solution:
      'GPT-4o returns the roadmap as strict JSON so the front end can always draw it. Line colours, stations and branching rules are defined in the prompt, so any CV draws cleanly.',
    stats: [
      { value: 'GPT-4o', label: 'generates the roadmap' },
      { value: 'JSON', label: 'strict schema the front end can always draw' },
      { value: 'PDF', label: 'matching training plan' },
      { value: 'CAIO', label: 'paths extend to VP of Technology and Chief AI Officer' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'CV upload',
        detail: 'A user uploads a CV to the Flask backend.',
        tech: ['flask'],
      },
      {
        key: 'understand',
        title: 'Roadmap generation',
        detail:
          'GPT-4o generates the roadmap against a strict JSON schema. Line colours, stations and branching rules are defined in the prompt.',
        tech: ['openai', 'structured', 'prompting'],
      },
      {
        key: 'decide',
        title: 'Validation and retries',
        detail: 'Validation and retries run in a background worker pool, so a malformed answer does not reach the map.',
        tech: ['workers'],
      },
      {
        key: 'act',
        title: 'Draw the map',
        detail:
          'The front end draws the paths as a subway map. From a single role the map extends to senior paths such as VP of Technology and Chief AI Officer, and a matching training plan is exported as a PDF.',
        tech: ['structured'],
      },
      {
        key: 'observe',
        title: 'Storage and access',
        detail: 'Results are stored in MySQL, and the Flask backend uses JWT authentication.',
        tech: ['mysql', 'auth'],
      },
    ],
    how: [
      'A user uploads a CV.',
      'GPT-4o produces the roadmap as JSON that matches a strict schema.',
      'A background worker pool validates it, retries if needed and stores it in MySQL.',
      'The front end draws the subway map, and a training plan is exported as a PDF.',
    ],
    decisions: [
      {
        title: 'A strict schema',
        body: 'The model has to return JSON that fits a schema, so the front end can draw the map every time.',
      },
      {
        title: 'Drawing rules live in the prompt',
        body: 'Line colours, stations and branching rules are defined in the prompt, so any CV produces a clean map.',
      },
      {
        title: 'Retries off the request path',
        body: 'Validation, retries and storage run in a background worker pool.',
      },
    ],
    stack: [
      { tech: 'openai', role: 'GPT-4o generates the roadmap' },
      { tech: 'structured', role: 'Strict JSON schema for the map' },
      { tech: 'prompting', role: 'Line colours, stations and branching rules' },
      { tech: 'flask', role: 'Backend' },
      { tech: 'auth', role: 'JWT authentication' },
      { tech: 'mysql', role: 'Storage' },
      { tech: 'workers', role: 'Background worker pool for validation and retries' },
      { tech: 'python', role: 'Primary language' },
    ],
    outcome: 'A CV goes in and a readable career map comes out, with a training plan for the path you choose.',
    note: FROM_RESUME,
  },
]
