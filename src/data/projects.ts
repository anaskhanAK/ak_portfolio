// Project knowledge map. Every statement below is derived from reading the source code in
// profile_details/*.zip. Numbers are counted from the code or data in the repositories.
// Client names are intentionally anonymised. No secrets, hosts or personal data appear here.

export type DomainId = 'platform' | 'ai' | 'markets' | 'automation'

export const domains: Record<DomainId, { label: string; short: string; color: string; soft: string; blurb: string }> = {
  platform: {
    label: 'Platforms & APIs',
    short: 'Platforms',
    color: 'var(--color-platform)',
    soft: 'var(--color-platform-soft)',
    blurb: 'Multi-role backends with auth, payments, storage and real-time updates.',
  },
  ai: {
    label: 'Applied AI',
    short: 'Applied AI',
    color: 'var(--color-ai)',
    soft: 'var(--color-ai-soft)',
    blurb: 'LLMs, NER and vision used as one stage of a working pipeline.',
  },
  markets: {
    label: 'Markets & Web3',
    short: 'Markets',
    color: 'var(--color-markets)',
    soft: 'var(--color-markets-soft)',
    blurb: 'Bots that watch exchanges, DEXs and brokers and act on rules.',
  },
  automation: {
    label: 'Automation & Scraping',
    short: 'Automation',
    color: 'var(--color-auto)',
    soft: 'var(--color-auto-soft)',
    blurb: 'Unattended workers that read the web, inboxes and screens.',
  },
}

export type StageKey = 'ingest' | 'understand' | 'decide' | 'act' | 'observe'

export const stageMeta: Record<StageKey, { label: string; verb: string }> = {
  ingest: { label: 'Ingest', verb: 'Where data comes from' },
  understand: { label: 'Understand', verb: 'How raw input becomes structure' },
  decide: { label: 'Decide', verb: 'Rules, models and gates' },
  act: { label: 'Act', verb: 'What the system does' },
  observe: { label: 'Observe', verb: 'How it stays trustworthy' },
}

export type Stage = { key: StageKey; title: string; detail: string; tech: string[] }

export type Project = {
  slug: string
  name: string
  short: string
  repo: string
  domain: DomainId
  alsoIn?: DomainId[]
  date: string // last commit, YYYY-MM
  kind: string
  featured: boolean
  tagline: string
  summary: string
  problem: string
  why: string
  solution: string
  stats: { value: string; label: string }[]
  pipeline: Stage[]
  how: string[]
  decisions: { title: string; body: string }[]
  stack: { tech: string; role: string }[]
  outcome: string
  snippet?: { file: string; caption: string; code: string }
  evidence: string[]
  note?: string
}

export const projects: Project[] = [
  // ───────────────────────────── FEATURED ─────────────────────────────
  {
    slug: 'nichetrx',
    name: 'NicheTRX: Freight Marketplace Platform',
    short: 'NicheTRX',
    repo: 'TRX-Backup',
    domain: 'platform',
    date: '2026-08',
    kind: 'Product · Independent / freelance',
    featured: true,
    tagline: 'A GCC truck-booking marketplace: bidding, dispatch, live tracking and payment in one backend.',
    summary:
      'Clients post freight jobs, vendors bid with their drivers, admins set the final price, drivers prove each delivery step, and clients pay by card.',
    problem:
      'Booking a truck across GCC cities and borders involves many hand-offs: finding an owner with the right truck, agreeing a price, confirming a driver, following the shipment and collecting payment. Without a shared system, nobody has a single view of the job.',
    why:
      'Every hand-off is a place where a shipment stalls or a payment is disputed. Shippers need certainty, truck owners need work, and the operator needs control over price and quality.',
    solution:
      'A FastAPI + PostgreSQL backend that models the whole job lifecycle with five roles. Each role sees only what it controls, and the admin sees everything: KYC approval, bid moderation, pricing, tickets and payments.',
    stats: [
      { value: '96', label: 'REST endpoints across 7 routers' },
      { value: '18', label: 'SQLAlchemy models, 10 enums' },
      { value: '5', label: 'roles with scoped access' },
      { value: '5-step', label: 'enforced delivery tracking' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'Job request + KYC',
        detail:
          'Clients post jobs with pickup/drop geo-points, region (in-city, intra-city or cross-border GCC), cargo, dimensions, labour, forklifts and customs details. Vendors and clients upload company and tax certificates at sign-up.',
        tech: ['fastapi', 'pydantic', 's3'],
      },
      {
        key: 'understand',
        title: 'Price bands + eligibility',
        detail:
          'Admin-managed route rates give a min/max price band per route type and truck type. Login is gated on two OTP verifications and an admin approval.',
        tech: ['postgresql', 'sqlalchemy', 'auth'],
      },
      {
        key: 'decide',
        title: 'Bidding → two-sided handshake',
        detail:
          'Approved jobs open for bidding and every vendor gets a push. Vendors bid with a driver and price. The admin accepts one bid and sets the client price. Client and driver must both confirm; a rejection from either side returns the job to bidding.',
        tech: ['fastapi', 'fcm'],
      },
      {
        key: 'act',
        title: 'Dispatch, tracking, payment',
        detail:
          'Drivers move through reached_pickup → picked_luggage → shipment_attached (photo required) → departed → delivered. Live GPS streams over Socket.IO rooms per job. Completed jobs are paid through Stripe Checkout.',
        tech: ['realtime', 'stripe', 's3'],
      },
      {
        key: 'observe',
        title: 'Oversight',
        detail:
          'Per-role dashboards with daily time series, support tickets by issue type and priority, a signature-verified Stripe webhook, and an admin override for cash payments.',
        tech: ['postgresql', 'stripe'],
      },
    ],
    how: [
      'A client registers (multipart form with certificates to S3), completes two OTP verifications and waits for admin approval before the first login.',
      'The client posts a job; it starts as pending until an admin approves it and opens bidding, which sends a Firebase push to every vendor.',
      'Vendors see open jobs with the route’s price band and existing bids, then bid with one of their drivers, a price and an optional truck photo.',
      'The admin accepts a bid and sets the final client price. All other bids are rejected and a job assignment is created.',
      'Client and driver confirm in either order. Only when both have accepted does the job move to in-progress.',
      'The driver posts each tracking step in strict order with coordinates; the shipment photo is mandatory. "Delivered" completes the job.',
      'The client pays through Stripe Checkout in SAR; the webhook verifies the signature and marks the assignment paid idempotently.',
    ],
    decisions: [
      {
        title: 'The order of events is enforced in code',
        body: 'Tracking steps are validated against a fixed sequence, so a driver cannot skip from pickup to delivered or post the same step twice.',
      },
      {
        title: 'Broker pricing is separate from bidding',
        body: 'The vendor’s bid and the price the client pays are stored separately, which lets the operator run a margin and keep pricing inside route-rate bands.',
      },
      {
        title: 'Payments trust the webhook, not the browser',
        body: 'The raw request body is verified with Stripe’s signature before an assignment is marked paid; lookups fall back from metadata to session id.',
      },
      {
        title: 'Private documents, short-lived links',
        body: 'KYC certificates, truck photos and proof-of-delivery images live in private S3 under UUID keys and are only served as one-hour presigned URLs.',
      },
      {
        title: 'Real-time inside the same ASGI app',
        body: 'A python-socketio server is mounted into FastAPI, with one room per job for live driver location broadcasts.',
      },
    ],
    stack: [
      { tech: 'fastapi', role: '96 endpoints over 7 routers (admin, clients, vendors, drivers, auth, payments, device)' },
      { tech: 'postgresql', role: 'System of record for users, jobs, bids, assignments, tracking, tickets' },
      { tech: 'sqlalchemy', role: '18 models and 10 enums; Alembic configured for migrations' },
      { tech: 'pydantic', role: 'Request/response schemas and validation' },
      { tech: 'auth', role: 'JWT access tokens, refresh tokens, OTP verification, role checks per router' },
      { tech: 'realtime', role: 'Socket.IO rooms per job for live GPS (lat, lng, speed, heading)' },
      { tech: 'stripe', role: 'Checkout sessions in SAR + signature-verified webhook' },
      { tech: 's3', role: 'KYC certificates, truck photos, job documents, delivery proof' },
      { tech: 'fcm', role: 'Push notifications for new jobs, approvals and rejections' },
      { tech: 'smtp', role: 'OTP and password-reset emails' },
      { tech: 'docker', role: 'python:3.11-slim image; entrypoint waits for Postgres, runs Alembic, starts Uvicorn' },
      { tech: 'python', role: '~8,100 lines across 24 modules' },
      { tech: 'react', role: 'Client-facing web front end' },
    ],
    outcome:
      'A complete marketplace backend designed and built end to end as an independent project: five roles, the full booking lifecycle, payments, push and live tracking, packaged in Docker.',
    snippet: {
      file: 'driver/services.py',
      caption: 'Delivery steps can only move forward one at a time, and proof is required.',
      code: `TRACKING_FLOW = [
    "reached_pickup",
    "picked_luggage",
    "shipment_attached",
    "departed",
    "delivered"
]

# …inside update_tracking_service()
if not last:
    if status != "reached_pickup":
        raise HTTPException(400, "First step must be reached_pickup")
else:
    last_index = TRACKING_FLOW.index(last_status)
    new_index = TRACKING_FLOW.index(status)
    if new_index != last_index + 1:
        raise HTTPException(400, "Invalid tracking sequence")

if status == "shipment_attached" and not image:
    raise HTTPException(400, "Shipment image required")`,
    },
    evidence: ['main.py', 'models.py', 'driver/services.py', 'payments/services.py', 'socket_events.py', 'utils/s3.py', 'Dockerfile', 'entrypoint.sh'],
  },
  {
    slug: 'support-gpt',
    name: 'Support Assistant Fine-Tuning Pipeline',
    short: 'Support GPT',
    repo: 'openai',
    domain: 'ai',
    date: '2024-02',
    kind: 'AI system · Client project',
    featured: true,
    tagline: 'Turns a helpdesk’s ticket history into a fine-tuned support model on a daily schedule.',
    summary:
      'Pulls real support conversations out of a ticketing database, turns them into chat training data with vehicle context, and runs OpenAI fine-tuning jobs automatically.',
    problem:
      'A motorcycle ECU-tuning software company answers the same technical questions every day, and the right answer depends on the customer’s bike: manufacturer, model, year and ECU number. That knowledge lived only in past tickets.',
    why:
      'A generic chatbot can’t answer vehicle-specific tuning questions, and writing training data by hand doesn’t keep up with new tickets.',
    solution:
      'An automated ETL from the osTicket MySQL database into OpenAI chat-format JSONL, with a thread-level train/validation split, followed by fine-tuning job automation and a feedback endpoint for rated answers.',
    stats: [
      { value: '5,135', label: 'support messages extracted' },
      { value: '789', label: 'ticket threads' },
      { value: '380 / 50', label: 'train / validation conversations' },
      { value: 'Daily', label: 'scheduled retraining run' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'osTicket MySQL',
        detail:
          'A SQL join across five osTicket tables pulls customer messages and staff responses, and pivots the custom form fields (manufacturer, model, year, ECU number) out of their key-value storage into columns.',
        tech: ['mysql', 'sql'],
      },
      {
        key: 'understand',
        title: 'Clean + structure',
        detail:
          'HTML is stripped with BeautifulSoup and text normalised. Each thread becomes a system / user / assistant conversation, with the vehicle details injected into the first user turn.',
        tech: ['python', 'scraping'],
      },
      {
        key: 'decide',
        title: 'Quality gates + split',
        detail:
          'Conversations are kept only if they open with a real customer turn, contain both roles and stay under 3,000 words per message. Threads are shuffled and split 90/10 by thread, so no conversation leaks between sets.',
        tech: ['python'],
      },
      {
        key: 'act',
        title: 'Fine-tune',
        detail:
          'Files are uploaded through the OpenAI Files API, a fine-tuning job is created on GPT-3.5-turbo, and the job is polled every 10 seconds until it succeeds or fails.',
        tech: ['openai'],
      },
      {
        key: 'observe',
        title: 'Feedback loop',
        detail:
          'A Flask endpoint collects star-rated assistant replies as new training examples for the next run. The whole cycle runs at start-up and daily at 10:00.',
        tech: ['flask', 'workers'],
      },
    ],
    how: [
      'A background worker starts with the Flask app and reads the latest ticket checkpoint.',
      'SQL extracts customer (M) and staff (R) messages with vehicle fields pivoted into columns.',
      'Each thread becomes a chat example: a system prompt that tells the model to say when it doesn’t know, a first user turn carrying the vehicle details, then alternating turns.',
      'Conversations that fail the quality rules are dropped; 430 of 789 threads passed.',
      'Training and validation files are written, uploaded, and a fine-tuning job is launched and monitored.',
      'Rated replies posted to /retune_with_rating are appended to the next training file.',
    ],
    decisions: [
      {
        title: 'Split by thread, not by message',
        body: 'Shuffling thread ids before the 90/10 split keeps every conversation entirely in one set, avoiding train/validation leakage.',
      },
      {
        title: 'Context the model can’t guess',
        body: 'Vehicle fields are pivoted out of osTicket’s key-value tables and placed in the prompt, with instructions to ask for anything missing.',
      },
      {
        title: 'Retraining as a scheduled job',
        body: 'Upload, job creation and polling are automated so the model can be refreshed without anyone running scripts.',
      },
    ],
    stack: [
      { tech: 'openai', role: 'Files API, fine-tuning jobs on GPT-3.5-turbo, job polling' },
      { tech: 'ml', role: 'Training data quality rules, train/validation split, scheduled retraining' },
      { tech: 'mysql', role: 'Read-only extraction from the osTicket schema' },
      { tech: 'sql', role: 'Five-table join + key-value pivot of custom form fields' },
      { tech: 'flask', role: 'Feedback endpoint for star-rated replies' },
      { tech: 'workers', role: 'Background thread + daily schedule (10:00) for retraining' },
      { tech: 'python', role: 'JSONL builder, HTML cleaning, quality filters' },
    ],
    outcome:
      'A repeatable pipeline that produced 380 training and 50 validation conversations from 789 real support threads, and a fine-tuning loop that can rerun daily with human-rated additions.',
    snippet: {
      file: 'createJsonl.py',
      caption: 'Thread ids are shuffled, then split 90/10 so whole conversations stay together.',
      code: `unique_ticket_ids = set()
for ticket_id in data:
    unique_ticket_ids.add(ticket_id["Thread ID"])

ids = sorted(list(unique_ticket_ids), key=lambda x: random.random())

train_part = int(0.9 * len(ids))
train_data = ids[:train_part]
val_data = ids[train_part:]`,
    },
    evidence: ['database.py', 'createJsonl.py', 'trainGPT.py', 'main.py'],
  },
  {
    slug: 'card-grading-arbitrage',
    name: 'Sports Card Grading-Arbitrage Finder',
    short: 'Card Scanner',
    repo: 'ebay_scrapper',
    domain: 'ai',
    date: '2024-11',
    kind: 'Data pipeline · NLP enrichment',
    featured: true,
    tagline: 'An NER-powered eBay scanner that finds raw sports cards worth sending for grading.',
    summary:
      'Ingests live eBay card listings, recovers missing player names with transformer NER, groups identical cards and ranks the gap between raw and PSA/BGS/SGC grade-9 and grade-10 prices.',
    problem:
      'Card flippers profit when a raw (ungraded) card sells for far less than graded copies of the same card. Spotting that across tens of thousands of listings by hand is impossible, and many listings don’t even name the player in structured fields.',
    why:
      'The opportunity exists only if you can match "the same card" reliably and compare prices fast, while the listings are still live.',
    solution:
      'A polling worker on the eBay Browse API that stores listings in SQLite, fills missing player names with a two-model NER cascade, clusters identical cards, and publishes ranked spreadsheets to Google Drive with an email alert.',
    stats: [
      { value: '26,006', label: 'listings stored and analysed' },
      { value: '884', label: 'player names recovered by NER' },
      { value: '6,096', label: 'distinct card sets' },
      { value: '3', label: 'ranked reports published' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'eBay Browse API',
        detail:
          'OAuth2 client-credentials auth, fixed-price sports-card searches over an incremental time window (200 per page), then item details for grade, grader, set, league, player and sport. Six API keysets rotate on failure.',
        tech: ['python', 'scraping'],
      },
      {
        key: 'understand',
        title: 'NER cascade',
        detail:
          'When eBay has no player field, a BERT-large CoNLL-03 NER pipeline extracts PERSON entities from the title; Flair’s NER tagger is the fallback. It ran on 1,372 listings and recovered 884 names.',
        tech: ['transformers', 'flair'],
      },
      {
        key: 'decide',
        title: 'Same-card matching',
        detail:
          'Names are normalised (initials, suffixes, punctuation), then listings are clustered by set → player → league → year. Prices are bucketed into raw, grade 9 and grade 10; a spread is kept only when even the cheapest graded copy beats the raw average.',
        tech: ['pandas', 'sqlite'],
      },
      {
        key: 'act',
        title: 'Ranked reports',
        detail:
          'Three CSVs (both grades, grade 10, grade 9) are ranked by number of comparable listings and uploaded to Google Drive as Google Sheets, followed by an email notification.',
        tech: ['google', 'smtp'],
      },
      {
        key: 'observe',
        title: 'Retention + dedup',
        detail: 'Titles are unique in SQLite, listings older than 90 days are purged, and each sport is matched in its own thread.',
        tech: ['sqlite', 'workers'],
      },
    ],
    how: [
      'Load the NER models once at start-up (GPU if available).',
      'Find the newest stored listing and search eBay from that moment to now, up to 9 pages per cycle.',
      'Fetch each item’s details; fill a missing sport with a regex over ~105 known sports.',
      'If the player is missing, run BERT NER on the title, then Flair if BERT finds nothing.',
      'Insert into SQLite (duplicates by title are dropped).',
      'Per sport, cluster identical cards and compute raw vs grade-9 / grade-10 spreads.',
      'Publish ranked Google Sheets and send an email; repeat.',
    ],
    decisions: [
      {
        title: 'Run the model only where it adds information',
        body: 'NER is applied only to listings with no player field (about 5% of them), keeping inference cost low while filling the gaps that break matching.',
      },
      {
        title: 'Two models, one answer',
        body: 'A high-recall BERT-large NER runs first and Flair is consulted only when BERT returns nothing.',
      },
      {
        title: 'Rate limits as a design constraint',
        body: 'Six keysets rotate whenever a call fails, with re-authentication and incremental windows so no time range is skipped.',
      },
    ],
    stack: [
      { tech: 'transformers', role: 'dbmdz/bert-large-cased-finetuned-conll03-english NER pipeline' },
      { tech: 'flair', role: 'Fallback SequenceTagger NER for player names' },
      { tech: 'ml', role: 'NER model cascade recovers missing player names' },
      { tech: 'pandas', role: 'Clustering, price bucketing and report generation' },
      { tech: 'sqlite', role: 'Listing store with unique titles and 90-day retention' },
      { tech: 'scraping', role: 'eBay Browse API ingestion with OAuth2 and keyset rotation' },
      { tech: 'google', role: 'Drive v3 upload that converts CSVs into Google Sheets' },
      { tech: 'smtp', role: 'Email notification when new reports are published' },
      { tech: 'workers', role: 'One matching thread per sport' },
    ],
    outcome:
      '26,006 listings collected between August and November 2024 across 130 sport labels, with 2,358 graded copies to compare against, published as three ranked spreadsheets (133, 79 and 64 rows).',
    snippet: {
      file: 'match.py',
      caption: 'A spread is reported only if every graded copy is priced above the raw average.',
      code: `def get_price_range(prices, value):
    if not prices:
        return None
    min_price = min(prices)
    max_price = max(prices)
    if min_price <= value:
        return None
    if min_price == max_price:
        return f"\${min_price - value:.2f}"
    return f"\${min_price - value:.2f}-\${max_price - value:.2f}"`,
    },
    evidence: ['main.py', 'match.py', 'database.py', 'csv_maker.py', 'upload_csv.py', 'name_filler_loader.dill'],
    note: 'Spreads are measured on live Buy-It-Now asking prices.',
  },
  {
    slug: 'solana-bot-suite',
    name: 'Solana Arbitrage, Sniper & Auto-Sell Engine',
    short: 'Solana Engine',
    repo: 'solana_arbitrage_and_sniper',
    domain: 'markets',
    date: '2026-05',
    kind: 'Trading system · Paper-trading on live quotes',
    featured: true,
    tagline: 'Three concurrent engines that scan, screen and exit Solana positions with risk gates at every step.',
    summary:
      'Triangular arbitrage on Jupiter quotes, a new-token sniper fed by a Birdeye WebSocket with rug-pull screening, and a take-profit auto-seller. All three share one ledger, audit log and dashboard.',
    problem:
      'On Solana, price gaps between tokens close in seconds and most newly launched tokens are traps. Acting on stale quotes or unscreened tokens loses money.',
    why:
      'Speed matters, but only if every decision is gated by fresh prices, price-impact limits and token safety checks.',
    solution:
      'One process running three engines in parallel threads with graceful shutdown, a SQLite position ledger with weighted-average cost, a structured audit trail and a Flask log dashboard, with Telegram alerts.',
    stats: [
      { value: '3', label: 'engines running concurrently' },
      { value: '12', label: 'arbitrage cycles from 5 tokens' },
      { value: '7', label: 'token safety rules' },
      { value: '69', label: 'audit event types' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'Quotes + new listings',
        detail:
          'Jupiter quote and token-search APIs for prices and audit data; a Birdeye WebSocket subscription for new listings from pump.fun AMM and Raydium LaunchLab.',
        tech: ['solana', 'realtime'],
      },
      {
        key: 'understand',
        title: 'Route + token profile',
        detail:
          'Arbitrage chains three quotes around a SOL-starting cycle with fees at each hop. New tokens are enriched with holder counts, authority flags, dev balance and organic score.',
        tech: ['solana', 'python'],
      },
      {
        key: 'decide',
        title: 'Risk gates',
        detail:
          'Quotes older than 10 s are rejected; routes must clear a gross profit threshold and then a fresh re-quote (≥98% of expected output, price-impact cap, minimum execution profit). Tokens must pass 7 safety rules.',
        tech: ['python'],
      },
      {
        key: 'act',
        title: 'Position ledger',
        detail:
          'Entries and exits are recorded against a simulated SOL balance with weighted-average cost; the auto-seller re-quotes held tokens every 5 minutes and exits at the take-profit target.',
        tech: ['sqlite', 'telegram'],
      },
      {
        key: 'observe',
        title: 'Audit + dashboard',
        detail:
          'Every decision is logged as a structured event; a Flask dashboard filters logs by module, level, type and text. A credit guard closes the stream when the API budget runs low.',
        tech: ['flask', 'sqlite'],
      },
    ],
    how: [
      'main_run.py starts the three engines as daemon threads sharing a stop event, plus a Flask dashboard; SIGINT/SIGTERM shut everything down cleanly.',
      'The arbitrage engine builds 12 cycles from a SOL/USDC/USDT/BONK/wETH whitelist and sizes each trade at 1% of balance.',
      'The sniper subscribes to new listings, keeps only pump.fun AMM and Raydium LaunchLab sources, and screens each token before quoting.',
      'The auto-seller quotes held tokens back to SOL every 300 s and exits at the configured profit.',
      'All results land in SQLite and are pushed to Telegram.',
    ],
    decisions: [
      {
        title: 'Validate twice before acting',
        body: 'A route that looks profitable is re-quoted end to end and must still clear output-ratio, price-impact and profit gates.',
      },
      {
        title: 'Screen tokens like a sceptic',
        body: 'Standard token program, ≥10 holders, mint and freeze authority disabled, dev wallet ≤20%, no dev mints after launch, non-low organic score, ≥5 traders in 24 h.',
      },
      {
        title: 'Budget-aware streaming',
        body: 'Birdeye credits are checked at start and on every pong; the socket closes itself before the budget is exhausted.',
      },
    ],
    stack: [
      { tech: 'solana', role: 'Jupiter quote + token search; Birdeye new-listing WebSocket' },
      { tech: 'realtime', role: 'websocket-client stream with ping/pong and credit checks' },
      { tech: 'sqlite', role: 'Wallet, 15-column position ledger and system_logs tables' },
      { tech: 'flask', role: '/logs (filter + paginate) and /dashboard' },
      { tech: 'telegram', role: 'Trade and cycle summaries to multiple chats' },
      { tech: 'workers', role: 'Three daemon threads with shared shutdown event' },
      { tech: 'python', role: '~1,970 lines across 10 modules' },
    ],
    outcome:
      'A complete decision engine that runs against live quotes and records simulated positions and PnL; an on-chain signing helper exists but is intentionally not wired into the engines.',
    snippet: {
      file: 'jupiter.py',
      caption: 'Seven reasons to walk away from a freshly launched token.',
      code: `def safety_check(self, min_holder, data):
    audit = data.get("audit", {})
    reasons = []

    if data.get("tokenProgram", "") != SPL_TOKEN_PROGRAM:
        reasons.append("Non-standard token program")
    if data.get("holderCount", 0) < min_holder:
        reasons.append(f"holders < {min_holder}")
    if not (audit.get("mintAuthorityDisabled") and audit.get("freezeAuthorityDisabled")):
        reasons.append("mint or freeze authority enabled")
    if audit.get("devBalancePercentage", 100) > 20:
        reasons.append("High dev wallet concentration")
    if audit.get("devMints", 0) > 0:
        reasons.append("Dev minted tokens after launch")
    if data.get("organicScoreLabel") == "low":
        reasons.append("Low organic score")
    # …plus a minimum 24h trader count`,
    },
    evidence: ['main_run.py', 'arbitrage.py', 'sniper.py', 'auto_sell.py', 'jupiter.py', 'database.py'],
    note: 'Runs in paper-trading mode: it uses live quotes but records simulated trades.',
  },
  {
    slug: 'tradingview-mail-watcher',
    name: 'Broker Email to TradingView Automation',
    short: 'TV Mail Watcher',
    repo: 'trading_view_mail_watcher',
    domain: 'automation',
    date: '2026-03',
    kind: 'Automation · Client delivery (milestone 1)',
    featured: true,
    tagline: 'Trade confirmations arrive by email; TradingView watchlists and chart markers update themselves.',
    summary:
      'An IMAP watcher parses broker trade-confirmation emails and PDFs, then drives TradingView with resilient Selenium tools to keep "Main" and "Open Positions" watchlists in sync.',
    problem:
      'A trader receiving broker confirmations (CommSec format) was manually adding every bought ticker to TradingView, removing sold ones from an open-positions list, and drawing price lines for entries and exits.',
    why:
      'Manual upkeep drifts from reality: missed trades, stale watchlists and no visual record of where positions were opened or closed.',
    solution:
      'A long-running poller that reads new emails, extracts ticker, side, quantity, price and date (falling back to the PDF), applies buy/sell rules, and runs each browser action as an isolated Selenium CLI with encrypted session reuse.',
    stats: [
      { value: '30 s', label: 'inbox polling interval' },
      { value: '6', label: 'single-purpose Selenium CLIs' },
      { value: '3', label: 'login strategies (incl. 2FA)' },
      { value: '5', label: 'fallback strategies to switch lists' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'IMAP inbox',
        detail:
          'IMAP over SSL searches for unseen messages from the broker, then walks every MIME part: plain text, HTML (scripts stripped) and PDF attachments.',
        tech: ['email-pdf'],
      },
      {
        key: 'understand',
        title: 'Parse the trade',
        detail:
          'Regex rules pull ticker, side, units, price and date from subject and body, with a 51-word stop list and partial-fill detection. If the email has no symbol, pdfminer extracts the PDF and anchor phrases locate the fields.',
        tech: ['email-pdf', 'scraping'],
      },
      {
        key: 'decide',
        title: 'Position rules',
        detail:
          'BUY → add to Main and Open Positions. Full SELL → remove from Open Positions. Partial fills keep the position open. Unknown side → add to Main.',
        tech: ['python'],
      },
      {
        key: 'act',
        title: 'Drive TradingView',
        detail:
          'Each action runs as its own Selenium subprocess: switch watchlist, search and add symbol, remove symbol, or draw a labelled BUY/SELL horizontal line at the exact price.',
        tech: ['selenium'],
      },
      {
        key: 'observe',
        title: 'Session + ledger',
        detail:
          'Processed messages are fingerprinted with SHA-256 into a CSV ledger; session cookies are Fernet-encrypted; a health-check CLI returns exit codes; systemd and Bash wrappers run it on Ubuntu.',
        tech: ['linux'],
      },
    ],
    how: [
      'Poll the inbox every 30 seconds and reconnect automatically if IMAP drops.',
      'Decode headers defensively and collect text, HTML and PDF content from each email.',
      'Extract the trade from the email; fall back to the PDF only if needed.',
      'Apply buy/sell/partial rules and call the matching CLI tools.',
      'Verify each watchlist add twice: in the panel, and via the chart header’s star state.',
      'Record the message fingerprint so it is never processed again.',
    ],
    decisions: [
      {
        title: 'Isolate the fragile part',
        body: 'Browser automation breaks in ways a poller shouldn’t. Running every action as a separate CLI process keeps the watcher alive when a page misbehaves.',
      },
      {
        title: 'Assume the UI will change',
        body: 'Every UI step has several selector strategies; switching watchlists alone has five, from keyboard shortcut to create-if-missing.',
      },
      {
        title: 'Log in once, reuse safely',
        body: 'A one-time manual login with 2FA saves Fernet-encrypted cookies (file mode 600); automated login with 2FA prompt or captcha solving is the fallback.',
      },
    ],
    stack: [
      { tech: 'email-pdf', role: 'imaplib + MIME walking + pdfminer.six text extraction' },
      { tech: 'selenium', role: 'Six CLI tools for watchlists and chart markers' },
      { tech: 'scraping', role: 'Regex extraction rules for tickers, side, units, price, date' },
      { tech: 'linux', role: 'systemd template unit, Bash wrappers, xvfb on Ubuntu' },
      { tech: 'python', role: '~3,100 lines; loguru logging; YAML config' },
    ],
    outcome:
      'Milestone 1 delivered for a client, documented for an Ubuntu server: trade emails drive two TradingView watchlists and the chart’s entry/exit lines with no manual upkeep.',
    snippet: {
      file: 'mail_watcher.py',
      caption: 'The position rules that turn a parsed trade into watchlist actions.',
      code: `if side == "BUY":
    add_symbol_to_watchlist(symbol, cfg, main_list)
    add_symbol_to_watchlist(symbol, cfg, open_list)
    plot_marker(symbol, "BUY", price, trade_date, cfg)

elif side == "SELL":
    if not partial:
        remove_symbol_from_watchlist(symbol, cfg, open_list)
    plot_marker(symbol, "SELL", price, trade_date, cfg)

else:
    add_symbol_to_watchlist(symbol, cfg, main_list)`,
    },
    evidence: ['mail_watcher.py', 'src/tv_watchlist.py', 'src/tv_session.py', 'src/cli_plot_marker.py', 'systemd/tv-add-symbols@.service', 'README.md'],
  },
  {
    slug: 'geo-qa-vision',
    name: 'Geo-Availability QA Bot with OCR and Computer Vision',
    short: 'Geo QA Bot',
    repo: 'betpanda',
    domain: 'automation',
    alsoIn: ['ai'],
    date: '2025-02',
    kind: 'QA automation · Client project',
    featured: true,
    tagline: 'Checks that every game in a catalogue really launches from 20 countries, with proof for each result.',
    summary:
      'A Selenium bot that opens each game through geo-targeted remote browsers, classifies the result with DOM checks, Tesseract OCR and OpenCV feature matching, and logs evidence to S3 and Google Sheets.',
    problem:
      'An online gaming operator offers titles from many studios, each with its own geo-restrictions. A game can be blocked or broken in one country and fine in another, and nobody can click through every game in every market.',
    why:
      'Showing unavailable or broken games to players in a market is a compliance and experience problem, and checking by hand doesn’t scale.',
    solution:
      'A resumable batch bot fed from Google Sheets that logs in through Bright Data’s geo-targeted remote browser, launches each game per country, and classifies the outcome with layered detection before recording a verdict and a screenshot.',
    stats: [
      { value: '20', label: 'countries checked per game' },
      { value: '4', label: 'outcome classes' },
      { value: '3', label: 'detection layers' },
      { value: '6', label: 'metadata fields per evidence file' },
    ],
    pipeline: [
      {
        key: 'ingest',
        title: 'Game catalogue',
        detail: 'Games (url, id, studio, title, aggregator) are read from a Google Sheet and processed in batches of 10 per login.',
        tech: ['google'],
      },
      {
        key: 'understand',
        title: 'Launch from each country',
        detail:
          'Each batch opens a Selenium remote session through Bright Data, with the exit country encoded in the proxy credentials, then logs in and launches each game.',
        tech: ['selenium'],
      },
      {
        key: 'decide',
        title: 'Layered classification',
        detail:
          'First the page’s alert text. If there is none, Tesseract OCR reads the screenshot and matches known phrases. Finally OpenCV SIFT feature matching (Lowe ratio 0.5) looks for the browser’s broken-page icon inside the game frame.',
        tech: ['tesseract', 'opencv'],
      },
      {
        key: 'act',
        title: 'Evidence + verdict',
        detail:
          'The screenshot is downscaled, uploaded to S3, and a 9-column row (time, country, game, studio, aggregator, status, evidence URL, iteration) is appended to the results sheet.',
        tech: ['s3', 'google'],
      },
      {
        key: 'observe',
        title: 'Resumable runs',
        detail: 'Every (game, country, iteration) already in the sheet is skipped, so a sweep can be restarted without duplicates.',
        tech: ['google'],
      },
    ],
    how: [
      'Read the game list and split it into batches of 10.',
      'For each of 20 countries, open a geo-targeted remote browser and log in once per batch.',
      'Skip games already checked for this country and iteration.',
      'Launch the game, dismiss modals, wait for load and take a screenshot.',
      'Classify: game_loads, provider_geo_not_allowed, internal_fail_message or internal_vpn_message.',
      'Upload the evidence, append the result row and clean up locally.',
    ],
    decisions: [
      {
        title: 'Read pixels when the DOM can’t help',
        body: 'Games render inside third-party frames and canvases, so the bot falls back from DOM text to OCR, and from OCR to visual feature matching.',
      },
      {
        title: 'Geo-testing without VPN infrastructure',
        body: 'The exit country is selected per session through the remote browser’s proxy credentials.',
      },
      {
        title: 'Evidence by default',
        body: 'Every verdict links to a screenshot whose file name encodes time, country, game, studio, aggregator and id.',
      },
    ],
    stack: [
      { tech: 'selenium', role: 'Remote WebDriver sessions via Bright Data scraping browser' },
      { tech: 'tesseract', role: 'OCR on screenshots matched against 9 known error phrases' },
      { tech: 'opencv', role: 'SIFT + brute-force kNN matching with Lowe’s ratio test' },
      { tech: 'ml', role: 'Vision and OCR classify each launch screen' },
      { tech: 's3', role: 'Evidence screenshot storage' },
      { tech: 'google', role: 'Game catalogue input and results table (gspread)' },
      { tech: 'python', role: 'Batch orchestration and retries' },
    ],
    outcome:
      'Turned a manual, country-by-country check into an unattended sweep with a verdict and a screenshot for every game in every market.',
    snippet: {
      file: 'image_reader.py',
      caption: 'The vision fallback: find the broken-page icon inside a screenshot.',
      code: `def is_icon_present(image_path, ratio_threshold=0.50):
    img1 = cv.imread("icon.png", cv.IMREAD_GRAYSCALE)
    img2 = cv.imread(image_path, cv.IMREAD_GRAYSCALE)

    sift = cv.SIFT_create()
    kp1, des1 = sift.detectAndCompute(img1, None)
    kp2, des2 = sift.detectAndCompute(img2, None)
    if des1 is None or des2 is None:
        return False

    matches = cv.BFMatcher().knnMatch(des1, des2, k=2)
    good = [m for m, n in matches if m.distance < ratio_threshold * n.distance]
    return len(good) > 0`,
    },
    evidence: ['main.py', 'image_reader.py', 'google_auth.py', 'aws.py'],
  },

  // ───────────────────────────── MORE WORK ─────────────────────────────
  {
    slug: 'creator-paywall',
    name: 'Creator Subscription Platform API',
    short: 'Creator Platform',
    repo: 'creators_patform',
    domain: 'platform',
    date: '2026-01',
    kind: 'Product backend · MVP',
    featured: false,
    tagline: 'A creator-subscription backend where non-subscribers only ever receive a blurred copy.',
    summary:
      'FastAPI backend for creators to publish image and video posts behind creator-level or post-level subscriptions, with an OpenCV blur pipeline and private S3 delivery.',
    problem:
      'Creators want to sell access to posts and still show a teaser, without the original file ever reaching someone who hasn’t subscribed.',
    why: 'A blur applied in the browser is cosmetic; the original is already downloaded. The paywall has to live on the server.',
    solution:
      'Every upload is processed twice, once as the original and once Gaussian-blurred (151×151 kernel, per image or per video frame), and both copies are stored privately. At read time the API decides per viewer which presigned URL to return.',
    stats: [
      { value: '39', label: 'REST endpoints' },
      { value: '7', label: 'data models' },
      { value: '2', label: 'subscription tiers' },
      { value: '1 h', label: 'presigned URL lifetime' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Upload', detail: 'Multipart image/MP4 upload behind a creator onboarding gate (7-field profile completion).', tech: ['fastapi'] },
      { key: 'understand', title: 'Blur', detail: 'OpenCV writes an original and a blurred copy; videos are blurred frame by frame.', tech: ['opencv'] },
      { key: 'decide', title: 'Who may see it', detail: 'Paid posts check creator-level and post-level subscriptions per viewer.', tech: ['sqlalchemy', 'auth'] },
      { key: 'act', title: 'Serve', detail: 'Return a one-hour presigned S3 URL to the original or the blurred key.', tech: ['s3'] },
    ],
    how: [
      'Register (creator or customer) or sign in with Google; JWT access tokens plus database-backed refresh tokens.',
      'Creators complete onboarding before posting; the API reports a completion percentage.',
      'Uploads are validated, blurred with OpenCV, and both copies stored in private S3 under UUID keys.',
      'Feeds and creator pages serialise each post per viewer, choosing original or blurred media.',
      'Subscriptions are soft-deleted on unsubscribe and reactivated on resubscribe, keeping one row per pair.',
    ],
    decisions: [
      { title: 'Paywall on the server', body: 'Originals are never exposed without a subscription; the variant is chosen at serialisation time.' },
      { title: 'Two subscription grains', body: 'Subscribe to a whole creator or unlock a single post.' },
      { title: 'Account-linking guard', body: 'Google sign-in refuses to silently take over an existing password account.' },
    ],
    stack: [
      { tech: 'fastapi', role: '39 endpoints across auth, users, creators, subscriptions, admin' },
      { tech: 'opencv', role: 'Gaussian blur for images and every video frame' },
      { tech: 's3', role: 'Private media storage + presigned delivery' },
      { tech: 'postgresql', role: 'Users, profiles, content, media, subscriptions' },
      { tech: 'sqlalchemy', role: '7 models with Alembic migration' },
      { tech: 'auth', role: 'JWT, refresh tokens, Google OAuth, role dependencies' },
      { tech: 'smtp', role: 'Password-reset codes' },
    ],
    outcome: 'An MVP-stage backend with the core creator economy flows in place: onboarding, publishing, discovery, subscriptions and a server-side paywall.',
    evidence: ['utils/post_processing.py', 'users/services.py', 'creators/services.py', 'models.py'],
  },
  {
    slug: 'ndis-report-generator',
    name: 'AI NDIS Report Generator',
    short: 'NDIS Reports',
    repo: 'Profile_Making',
    domain: 'ai',
    date: '2024-03',
    kind: 'Generative AI microservice',
    featured: false,
    tagline: 'Turns a 126-question disability-support questionnaire into a ready-to-submit PDF.',
    summary:
      'A Flask microservice that summarises each questionnaire section with GPT-3.5-turbo and lays the result out as an NDIS re-assessment submission in PDF.',
    problem:
      'Families of school leavers re-assessed under Australia’s NDIS must write a long statement across six support domains and many supporting sections. It is slow and stressful to write.',
    why: 'The answers already exist in a questionnaire; what’s missing is turning them into clear, first-person prose in the expected structure.',
    solution:
      'Group answers by section, summarise each section with a focused LLM call, map the results onto the NDIS six-domain layout, render HTML to A4 PDF, and notify the main platform when done.',
    stats: [
      { value: '126', label: 'questions across 15 sections' },
      { value: '6', label: 'NDIS domains laid out' },
      { value: '1', label: 'LLM call per section' },
      { value: 'Async', label: 'generation with callback' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Questionnaire', detail: 'POST /generate_report with personal details, answers, career statement and support schedule; returns immediately.', tech: ['flask'] },
      { key: 'understand', title: 'Summarise', detail: 'Each answered section becomes one GPT-3.5-turbo prompt asking for a single first-person paragraph.', tech: ['openai'] },
      { key: 'decide', title: 'Lay out', detail: 'Summaries are routed into the six NDIS domains or the supporting sections.', tech: ['python'] },
      { key: 'act', title: 'Render + notify', detail: 'HTML/CSS rendered to A4 PDF with wkhtmltopdf; the main platform is called back with the file name.', tech: ['frontend', 'workers'] },
    ],
    how: [
      'Accept the payload and start a background worker.',
      'Group questions by heading and keep only answered ones.',
      'Summarise section by section with GPT-3.5-turbo.',
      'Build the submission: participant details, six domains, supporting sections, career statement, schedule table.',
      'Render to PDF and call the platform’s save-report endpoint.',
    ],
    decisions: [
      { title: 'Small prompts beat one giant prompt', body: 'One focused call per section keeps each summary on-topic and maps cleanly onto the document layout.' },
      { title: 'Don’t make the user wait', body: 'The HTTP request returns immediately; a callback tells the platform when the PDF is ready.' },
    ],
    stack: [
      { tech: 'openai', role: 'Chat Completions (gpt-3.5-turbo) for section summaries' },
      { tech: 'flask', role: 'Report endpoint' },
      { tech: 'frontend', role: 'HTML/CSS document template rendered by wkhtmltopdf' },
      { tech: 'workers', role: 'Background thread + REST callback' },
    ],
    outcome: 'Produces a complete 3-page A4 submission from questionnaire answers without anyone writing prose by hand.',
    evidence: ['gpt.py', 'pdf_maker.py', 'main.py'],
  },
  {
    slug: 'crypto-arbitrage-scanner',
    name: 'Multi-Exchange Crypto Arbitrage Scanner',
    short: 'CEX Arbitrage',
    repo: 'arbitrage_with_trust_wallet',
    domain: 'markets',
    date: '2025-04',
    kind: 'Trading bot · Alerting',
    featured: false,
    tagline: 'Fee-aware cross-exchange and triangular arbitrage alerts across six exchanges.',
    summary:
      'Two scanners pull prices from six centralised exchanges through ccxt, subtract trading and withdrawal fees, and alert on Telegram and email when a gap clears the threshold.',
    problem: 'Price gaps between exchanges look profitable until fees are counted. Traders need to see only the gaps that survive fees.',
    why: 'Withdrawal fees vary per asset and exchange and often erase a gap entirely.',
    solution:
      'Parallel price fetches with ccxt rate limiting, taker fees from market metadata, a hand-built table of 265 withdrawal fees, and alerts with a dedicated opportunity log.',
    stats: [
      { value: '6', label: 'exchanges scanned' },
      { value: '265', label: 'withdrawal-fee entries modelled' },
      { value: '20 s', label: 'scan cycle' },
      { value: '2', label: 'strategies' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Prices', detail: 'Nested thread pools fetch tickers from Kraken, Coinbase, Gemini, Bitstamp, bitFlyer and Crypto.com.', tech: ['ccxt', 'workers'] },
      { key: 'understand', title: 'Net of fees', detail: 'Buy cost, taker fees and withdrawal fees in both assets are applied to each route.', tech: ['ccxt'] },
      { key: 'decide', title: 'Threshold', detail: 'Keep the best route per pair above the minimum profit; triangles chain three conversions.', tech: ['python'] },
      { key: 'act', title: 'Alert', detail: 'Telegram + SMTP alerts and a filtered arbitrage log.', tech: ['telegram', 'smtp'] },
    ],
    how: [
      'Load markets for six exchanges with rate limiting enabled.',
      'Fetch prices in parallel every 20 seconds (drift-corrected).',
      'Compute fee-adjusted profit for cross-exchange routes and per-exchange triangles.',
      'Alert on opportunities and keep separate info, error and opportunity logs.',
    ],
    decisions: [
      { title: 'Fees are part of the signal', body: 'Taker and withdrawal fees are modelled per exchange and asset before anything is reported.' },
      { title: 'Alert, don’t trade', body: 'The scanner surfaces opportunities to people rather than executing them.' },
    ],
    stack: [
      { tech: 'ccxt', role: 'Unified market data across six exchanges' },
      { tech: 'workers', role: 'Thread-pool fan-out of ticker requests' },
      { tech: 'telegram', role: 'Opportunity alerts' },
      { tech: 'smtp', role: 'Email alerts' },
    ],
    outcome: 'A scanner that reports only fee-adjusted opportunities, across six exchanges, on a fixed cadence.',
    evidence: ['cross_exchange_scanner.py', 'triangular_scanner.py', 'markets.py', 'withdraw.py'],
  },
  {
    slug: 'ig-markets-signals',
    name: 'IG Markets API & Real-Time Signal Service',
    short: 'IG Signals',
    repo: 'IG_Market',
    domain: 'markets',
    date: '2024-11',
    kind: 'Trading backend',
    featured: false,
    tagline: 'Live IG prices streamed over Lightstreamer and turned into SMA signals over WebSockets.',
    summary:
      'A Flask REST proxy over the IG Markets API for sessions, markets and watchlists, plus a Socket.IO service that streams prices and pushes moving-average signals.',
    problem: 'A trading front end needed IG account access, watchlist management and live signals without talking to IG directly.',
    why: 'Streaming ticks must be turned into bars at the chart’s resolution before any indicator means anything.',
    solution:
      'REST endpoints for login (with account switching), market browsing and watchlist CRUD; a streaming subprocess samples ticks into bars and an SMA rule emits buy/sell updates.',
    stats: [
      { value: '7', label: 'REST endpoints' },
      { value: '5', label: 'bar resolutions' },
      { value: '77', label: 'instrument codes catalogued' },
      { value: '2', label: 'Flask services' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Stream', detail: 'trading_ig opens a Lightstreamer MERGE subscription for the chosen market.', tech: ['ig'] },
      { key: 'understand', title: 'Bars', detail: 'Ticks are sampled into bars aligned to the requested resolution.', tech: ['ig', 'pandas'] },
      { key: 'decide', title: 'Signal', detail: 'Price vs SMA decides buy or sell; repeats are suppressed.', tech: ['pandas'] },
      { key: 'act', title: 'Push', detail: 'Signals go to the client over Flask-SocketIO and by email.', tech: ['realtime', 'smtp'] },
    ],
    how: [
      'Proxy IG REST for sessions, market navigation (8 asset groups) and watchlists.',
      'On WebSocket connect, seed 24 h of history and start the streaming subprocess.',
      'Compute the SMA on each new bar and emit a signal when it changes.',
      'Stop the stream and clean up when the client disconnects.',
    ],
    decisions: [
      { title: 'Process isolation for streaming', body: 'The Lightstreamer client runs in its own process so the Socket.IO server stays responsive.' },
      { title: 'Multi-account sessions', body: 'Login falls back to switching accounts when the requested account isn’t the default.' },
    ],
    stack: [
      { tech: 'ig', role: 'IG REST v2/v3 + Lightstreamer streaming via trading_ig' },
      { tech: 'flask', role: 'REST proxy service' },
      { tech: 'realtime', role: 'Flask-SocketIO signal push' },
      { tech: 'pandas', role: 'NumPy moving average' },
      { tech: 'smtp', role: 'Signal emails' },
    ],
    outcome: 'A backend that gives a client app IG account access and real-time indicator signals over one socket.',
    evidence: ['main.py', 'markets.py', 'socket_io.py', 'stream.py', 'calculate_sma.py'],
  },
  {
    slug: 'forex-calendar-etl',
    name: 'Economic Calendar Scraper & API',
    short: 'Forex Calendar',
    repo: 'forex_factory_scrapper',
    domain: 'automation',
    alsoIn: ['markets'],
    date: '2025-11',
    kind: 'Data service',
    featured: false,
    tagline: 'Macro-economic events, scraped from behind Cloudflare and served as clean JSON.',
    summary:
      'A scheduled scraper that reads the Forex Factory calendar’s embedded JavaScript state, stores events idempotently in PostgreSQL and serves them through a date-filtered API.',
    problem: 'Trading tools need high-impact economic events as data, but the source has no public API and sits behind Cloudflare.',
    why: 'Bots can avoid or target news windows only if the calendar is machine-readable and current.',
    solution:
      'cloudscraper fetches the page, regex + json5 parse the embedded state, events are de-duplicated by id into PostgreSQL every 30 minutes, and Flask serves them.',
    stats: [
      { value: '30 min', label: 'ingestion schedule' },
      { value: '6', label: 'fields per event' },
      { value: '3', label: 'API query modes' },
      { value: 'Idempotent', label: 'inserts keyed by event id' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Fetch', detail: 'cloudscraper retrieves the calendar page through Cloudflare.', tech: ['scraping'] },
      { key: 'understand', title: 'Parse state', detail: 'Regex captures the embedded component state; json5 parses the JavaScript object literal.', tech: ['scraping'] },
      { key: 'decide', title: 'Dedup', detail: 'Events are inserted only if their id is new.', tech: ['postgresql'] },
      { key: 'act', title: 'Serve', detail: 'GET /api/calendar returns all events, today, or a given date.', tech: ['flask'] },
    ],
    how: [
      'Run once on start, then every 30 minutes in a background thread with a stop event.',
      'Map id, time (UTC), name, country, currency and impact for each event.',
      'Insert new events through a reconnecting PostgreSQL connection.',
      'Serve JSON with optional date filtering.',
    ],
    decisions: [
      { title: 'Parse the data, not the markup', body: 'Reading the page’s embedded state is more stable than scraping rendered table cells.' },
      { title: 'One scheduler, even in debug', body: 'The worker starts only in the reloader child, avoiding duplicate schedulers.' },
    ],
    stack: [
      { tech: 'scraping', role: 'cloudscraper + regex + json5' },
      { tech: 'postgresql', role: 'Idempotent event storage' },
      { tech: 'workers', role: 'schedule-driven background thread' },
      { tech: 'flask', role: 'Calendar API' },
    ],
    outcome: 'A small, reliable data service that keeps economic events current for downstream trading tools.',
    evidence: ['scrapper.py', 'database.py', 'main.py'],
  },
  {
    slug: 'wallet-onboarding-api',
    name: 'Wallet Onboarding & Auth API',
    short: 'Wallet API',
    repo: 'cosmos',
    domain: 'platform',
    alsoIn: ['markets'],
    date: '2026-05',
    kind: 'Backend API · Proof of concept',
    featured: false,
    tagline: 'Account security and seed-phrase onboarding for an EVM wallet app.',
    summary:
      'A FastAPI service with full email-verified authentication and a wallet API that generates BIP-39 phrases, quizzes the backup and derives EVM addresses.',
    problem: 'A consumer wallet app needs safe account flows and a familiar "write down your phrase, prove you did" onboarding.',
    why: 'Users who skip the backup step lose funds; account flows must not leak who is registered.',
    solution:
      'Email-link verification, JWT access tokens with revocable refresh tokens, password reset without account enumeration, and a stateless wallet API using eth-account.',
    stats: [
      { value: '16', label: 'endpoints' },
      { value: '12', label: 'word BIP-39 phrases' },
      { value: '3', label: 'random backup checks' },
      { value: '2', label: 'import paths' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Account', detail: 'Register, verify by email link, log in only when verified.', tech: ['fastapi', 'smtp'] },
      { key: 'understand', title: 'Phrase', detail: 'Generate a 12-word BIP-39 phrase and return it indexed.', tech: ['evm'] },
      { key: 'decide', title: 'Backup quiz', detail: 'Ask for 3 random word positions and validate the checksum.', tech: ['evm'] },
      { key: 'act', title: 'Derive', detail: 'Derive the EVM address (m/44’/60’/0’/0/0), or import from mnemonic or key.', tech: ['evm'] },
    ],
    how: [
      'Verification, reset and refresh tokens come from the secrets module and expire.',
      'Refresh tokens can be revoked at logout; suspended or inactive accounts are blocked at the auth dependency.',
      'Forgot-password responds identically whether or not the account exists.',
      'Wallet endpoints are JWT-protected and stateless.',
    ],
    decisions: [
      { title: 'No account enumeration', body: 'Password-reset requests never reveal whether an email is registered.' },
      { title: 'Revocable sessions', body: 'Refresh tokens are stored and can be revoked, so logout really logs out.' },
    ],
    stack: [
      { tech: 'fastapi', role: '/auth (11) and /wallets (5)' },
      { tech: 'evm', role: 'BIP-39 mnemonic + eth-account HD derivation' },
      { tech: 'auth', role: 'JWT + revocable refresh tokens' },
      { tech: 'postgresql', role: 'Users and token tables' },
      { tech: 'smtp', role: 'HTML verification and reset emails' },
    ],
    outcome: 'A proof-of-concept backend covering secure account lifecycle and wallet creation/import flows.',
    evidence: ['auth/services.py', 'wallet/services.py', 'templates/verify_email.html'],
  },
  {
    slug: 'pga-iso-metrics',
    name: 'Golf Data API & "ISO Metrics" Pattern Engine',
    short: 'PGA Metrics',
    repo: 'PGA-Tour',
    domain: 'platform',
    date: '2024-12',
    kind: 'Analytics API',
    featured: false,
    tagline: 'PGA TOUR data behind a clean REST API, plus a date-symmetry form signal.',
    summary:
      'A Flask API over the PGA TOUR GraphQL data service for players, profiles, results and schedules, with a background engine that scans every active player for a midpoint-win pattern.',
    problem: 'The data a golf picks tool needs sits behind deeply nested GraphQL responses, and the client wanted a custom form signal on top.',
    why: 'Front ends need small, predictable payloads, and a full-tour scan is too slow to run inside a request.',
    solution:
      'Seven endpoints that reshape seven GraphQL operations, plus a scan that flags players whose win sits exactly midway between an earlier top-10 and the upcoming event. The scan runs as a background job with a pollable status.',
    stats: [
      { value: '7', label: 'REST endpoints' },
      { value: '7', label: 'GraphQL operations' },
      { value: '1,107', label: 'lines of Python' },
      { value: 'Async', label: 'scan with status polling' },
    ],
    pipeline: [
      { key: 'ingest', title: 'GraphQL', detail: 'Hand-written queries for directory, schedule, profiles, career and results.', tech: ['graphql'] },
      { key: 'understand', title: 'Reshape', detail: 'Nested responses become compact JSON with fixed snake_case fields.', tech: ['python'] },
      { key: 'decide', title: 'Pattern', detail: 'For each win W and target date: mirror = W − |target − W|; flag if a top-10 sits on the mirror date.', tech: ['python'] },
      { key: 'act', title: 'Serve', detail: 'Start a scan, poll its status, or compute one player on demand.', tech: ['flask', 'workers'] },
    ],
    how: [
      'Expose players, a composite player profile, season results and the tournament schedule.',
      'Start the full-tour scan in a background thread; results stream into a JSON store with a running flag.',
      'Clients poll for results or request a single player synchronously.',
    ],
    decisions: [
      { title: 'Async without infrastructure', body: 'A thread, a persisted status flag and a polling endpoint replace a queue for a single long job.' },
    ],
    stack: [
      { tech: 'graphql', role: 'Seven hand-written operations and fragments' },
      { tech: 'flask', role: 'Seven REST endpoints' },
      { tech: 'workers', role: 'Background scan with status flag' },
    ],
    outcome: 'A compact API and a custom analytics signal ready for a picks front end.',
    evidence: ['pga.py', 'iso_metrics.py', 'main.py'],
  },
  {
    slug: 'people-search-portal',
    name: 'People Search Portal (Front End)',
    short: 'People Search',
    repo: 'search_info',
    domain: 'platform',
    date: '2023-12',
    kind: 'Web front end · Client project',
    featured: false,
    tagline: 'Search, profile reports, a freemium PDF flow and an admin console, all in vanilla JS.',
    summary:
      'A multi-page front end served by Express that integrates 20 endpoints of a profile-aggregation API: search with autocomplete, results, reports, PayPal checkout and admin curation.',
    problem: 'A people-search service needed its customer-facing site and an operator console on top of an existing backend API.',
    why: 'The business model depended on a clear free-vs-paid report flow and on operators being able to curate profiles quickly.',
    solution:
      'Materialize CSS pages with one script each: location autocomplete, profile cards, search history, blurred vs full PDF downloads, PayPal Smart Buttons, and admin forms for creating and updating profiles.',
    stats: [
      { value: '22', label: 'HTML views' },
      { value: '20', label: 'API endpoints integrated' },
      { value: '12', label: 'Express routes' },
      { value: '2', label: 'report tiers (free / paid)' },
    ],
    pipeline: [
      { key: 'ingest', title: 'Search', detail: 'Name + location with autocomplete from the API.', tech: ['javascript'] },
      { key: 'understand', title: 'Profiles', detail: 'Aggregated profile cards and detail pages.', tech: ['javascript', 'frontend'] },
      { key: 'decide', title: 'Free or paid', detail: 'Subscription check toggles blurred vs full report downloads.', tech: ['paypal'] },
      { key: 'act', title: 'Curate', detail: 'Admin console: paginate, search, create and update profiles with images.', tech: ['javascript'] },
    ],
    how: [
      'Express serves clean routes for 12 pages; the backend host is configurable without a rebuild.',
      'Results, history and report downloads are wired to the API with authenticated blob downloads.',
      'PayPal Smart Buttons handle checkout for full reports.',
      'Admins manage profile records, websites and post images.',
    ],
    decisions: [{ title: 'Configurable backend host', body: 'Pages read the API host from storage, so one build works across environments.' }],
    stack: [
      { tech: 'javascript', role: 'Page scripts, fetch/XHR, state' },
      { tech: 'frontend', role: 'Materialize CSS + jQuery UI' },
      { tech: 'express', role: 'Static server with clean routes' },
      { tech: 'paypal', role: 'Checkout for paid reports' },
    ],
    outcome: 'A complete customer site and operator console delivered against an existing API.',
    evidence: ['app.js', 'views/scripts/results.js', 'views/scripts/create-profile.js'],
  },
  {
    slug: 'ebook-preview-capture',
    name: 'E-book Preview Capture Tool',
    short: 'Reader Capture',
    repo: 'e_book',
    domain: 'automation',
    date: '2024-01',
    kind: 'Browser automation tool',
    featured: false,
    tagline: 'Paste a reader URL; a headless browser pages through the preview and returns images.',
    summary:
      'A Flask + Selenium tool with per-site strategies for three Japanese e-book storefront readers: right-to-left paging, overlay handling and end-of-book detection.',
    problem: 'Each storefront’s in-browser reader behaves differently: overlays, modals, new tabs and unknown book lengths.',
    why: 'One input should work across storefronts without per-book configuration.',
    solution:
      'URL-based dispatch to a strategy per site, arrow-key paging in reading order, and DOM sentinels to know when the preview ends.',
    stats: [
      { value: '3', label: 'storefront strategies' },
      { value: '3', label: 'Flask routes' },
      { value: 'RTL', label: 'reading-order paging' },
      { value: '0', label: 'per-book configuration' },
    ],
    pipeline: [
      { key: 'ingest', title: 'URL', detail: 'A Bootstrap form posts the reader URL.', tech: ['flask', 'frontend'] },
      { key: 'understand', title: 'Pick strategy', detail: 'Dispatch by URL prefix to the matching reader handler.', tech: ['python'] },
      { key: 'decide', title: 'When to stop', detail: 'Site-specific DOM sentinels detect the end of the preview.', tech: ['selenium'] },
      { key: 'act', title: 'Capture', detail: 'Screenshot each page and return the images to the browser.', tech: ['selenium'] },
    ],
    how: ['Open the reader headless.', 'Dismiss overlays and follow new tabs.', 'Turn pages and screenshot until a sentinel appears.', 'Return the image list as cards.'],
    decisions: [{ title: 'Detect the end, don’t count pages', body: 'DOM sentinels handle books of any length.' }],
    stack: [
      { tech: 'selenium', role: 'Headless reader automation' },
      { tech: 'flask', role: 'Form and image endpoints' },
      { tech: 'frontend', role: 'Bootstrap + vanilla JS page' },
    ],
    outcome: 'One URL in, a set of preview page images out, across three reader implementations.',
    evidence: ['scrapper.py', 'main.py', 'templates/index.html'],
  },
]

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p])) as Record<string, Project>

export function projectsUsingTech(techId: string) {
  return projects
    .map((p) => ({ project: p, use: p.stack.find((s) => s.tech === techId) }))
    .filter((x) => x.use || x.project.pipeline.some((s) => s.tech.includes(techId)))
}

export function formatMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}
