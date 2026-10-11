// Single source for the updated resume (PDF + DOCX are both generated from this).
// Every claim is either carried over from the original resume or backed by code in profile_details/.
// See ../../../resume/RESUME_AUDIT.md for the gap analysis behind each change.

export const resume = {
  name: 'Anas Khan',
  title: 'AI & Full Stack Engineer · Team Lead, Python & AI',
  contact: ['0349-5112722', 'anaskhankin1999@gmail.com', 'Pakistan'],

  summary:
    'Python and AI engineering lead with 6+ years at Tassaract, promoted from Full Stack Developer to Senior Full Stack Developer to Team Lead of the Python & AI team. Builds production backends with FastAPI, Flask and Django on PostgreSQL; automation and trading bots on exchange, DEX and broker APIs; and applied-AI pipelines spanning OpenAI fine-tuning, LLM document generation, transformer-based NER and OCR/computer vision. Owns delivery end to end, from architecture and data modelling to Docker deployment, and leads the developers who build it.',

  skills: [
    ['Languages', 'Python, JavaScript, SQL, HTML, CSS'],
    ['Backend & APIs', 'FastAPI, Flask, Django, REST API design, Pydantic, SQLAlchemy, Alembic, JWT / OAuth2 auth and role-based access, Socket.IO / WebSockets, GraphQL (client)'],
    ['AI / ML', 'OpenAI API (fine-tuning, Chat Completions), prompt engineering, Hugging Face Transformers (BERT NER), Flair, OpenCV, Tesseract OCR, pandas, NumPy, machine learning'],
    ['Data & Infrastructure', 'PostgreSQL, MySQL, SQLite, AWS S3, Docker, Linux (Ubuntu, systemd, Bash)'],
    ['Automation', 'Selenium, web scraping (cloudscraper, BeautifulSoup), IMAP and PDF parsing (pdfminer), schedulers and background workers, bot development'],
    ['Trading & Blockchain', 'Arbitrage bots, ccxt, Solana DeFi APIs (Jupiter, Birdeye), IG Markets API (Lightstreamer), EVM wallets (BIP-39, eth-account)'],
    ['Integrations', 'Stripe, Firebase Cloud Messaging, Google Sheets and Drive APIs, eBay Browse API, Telegram Bot API, SMTP, PayPal'],
    ['Frontend', 'React.js, JavaScript, HTML, CSS, Bootstrap, Materialize'],
    ['Leadership', 'Team leadership, AI team management, project planning, code review, mentoring'],
  ],

  experience: [
    {
      title: 'Team Lead, Python & AI Team',
      org: 'Tassaract',
      dates: '2024 - Present',
      bullets: [
        'Lead a team of Python and AI developers: project planning, task breakdowns, code reviews and on-time delivery.',
        'Design and build full stack web applications in Python (Flask, Django), from database design through to the final UI.',
        'Guide machine learning work from data analysis and model building into applications the business uses day to day.',
        'Add AI features with the OpenAI API, including chatbot-style features that handle user queries automatically.',
        'Oversee automation and bot projects, from internal workflow bots to arbitrage bots that act on price differences across platforms, kept running through APIs, schedulers and background jobs.',
        'Improved the team’s web scraping and automation so data extraction is faster, more reliable and needs less manual cleanup.',
        'Mentor junior developers through code review and hands-on guidance, helping them grow into more senior roles.',
      ],
    },
    {
      title: 'Senior Full Stack Developer',
      org: 'Tassaract',
      dates: '2021 - 2024',
      bullets: [
        'Built and maintained full stack web applications with Python, Flask and Django, across backend logic and front end.',
        'Wrote scraping and automation scripts that pull data from multiple sources, cutting manual data entry.',
        'Built automation bots for repetitive internal tasks, including early arbitrage bots that tracked prices across platforms.',
        'Delivered blockchain features: wallet integration, on-chain transaction handling and smart-contract interactions inside web applications.',
        'Built an OpenAI-powered chatbot for common customer and internal queries, with conversation flows that hand off to a human when needed.',
        'Built responsive front ends with React.js, HTML, CSS and JavaScript; delivered ML projects from data analysis to deployed models.',
        'Built internal business applications for other departments, working directly with their users to fit real workflows.',
      ],
    },
    {
      title: 'Full Stack Developer',
      org: 'Tassaract',
      dates: '2019 - 2021',
      bullets: [
        'Built and maintained web applications using Python with Flask and Django, and front-end pages with React.js, HTML, CSS and JavaScript.',
        'Wrote first automation bots and scraping scripts to collect and process data; supported early blockchain experiments around wallet connections and transaction testing.',
        'Learned full stack development on the job from senior engineers, which led to two promotions.',
      ],
    },
  ],

  projects: [
    {
      name: 'NicheTRX: Freight Marketplace Platform',
      context: 'Independent / Freelance',
      stack: 'FastAPI, PostgreSQL, SQLAlchemy, Socket.IO, Stripe, AWS S3, Firebase, Docker, React',
      bullets: [
        'Designed and built a GCC truck-booking marketplace end to end: 96 REST endpoints across 7 routers and 18 data models for clients, vendors (fleet and individual owners), drivers and admins, with KYC uploads and approval.',
        'Modelled the full job lifecycle: admin-moderated posting, vendor bidding, admin-set pricing within route-rate bands, two-sided client/driver confirmation, an enforced 5-step delivery tracking flow with photo proof, and Stripe Checkout confirmed by a signature-verified webhook.',
        'Added live GPS tracking over Socket.IO rooms, Firebase push notifications and private S3 storage with presigned URLs; containerised with Docker (database readiness check, Alembic migrations, Uvicorn).',
      ],
    },
    {
      name: 'Support Assistant Fine-Tuning Pipeline',
      stack: 'OpenAI API, MySQL, Flask',
      bullets: [
        'Built an ETL from a client’s osTicket MySQL helpdesk into OpenAI chat-format training data: 5,135 messages from 789 threads, vehicle/ECU context from custom form fields, thread-level split (380 train / 50 validation).',
        'Automated GPT-3.5-turbo fine-tuning (file upload, job creation, status polling) on a daily schedule, with a feedback endpoint that adds star-rated replies to the next training run.',
      ],
    },
    {
      name: 'Sports Card Grading-Arbitrage Finder',
      stack: 'eBay Browse API, Hugging Face Transformers, Flair, pandas, SQLite, Google Drive API',
      bullets: [
        'Built a scanner on the eBay Browse API (OAuth2, rotation across 6 keysets) that stored 26,006 listings; a BERT-large NER model with a Flair fallback recovered player names for 884 of 1,372 listings that lacked them.',
        'Matched identical cards and ranked raw vs. grade-9 / grade-10 (PSA, BGS, SGC) price spreads, publishing the reports to Google Sheets with email alerts.',
      ],
    },
    {
      name: 'Solana Arbitrage, Sniper & Auto-Sell Engine',
      stack: 'Python, Jupiter API, Birdeye WebSocket, SQLite, Flask, Telegram',
      bullets: [
        'Built three concurrent engines (triangular arbitrage on Jupiter quotes, a new-token sniper on a Birdeye WebSocket feed, and a take-profit auto-seller) with graceful shutdown and Telegram alerts.',
        'Added risk gates (10-second quote expiry, re-quote validation with price-impact caps, a 7-rule token safety screen), a SQLite ledger with 69 audit event types and a Flask dashboard; paper-trades on live quotes.',
      ],
    },
    {
      name: 'Broker Email to TradingView Automation',
      stack: 'IMAP, pdfminer, Selenium, cryptography, systemd',
      bullets: [
        'Delivered a client automation in which an IMAP watcher parses broker trade-confirmation emails and PDFs and keeps TradingView watchlists and chart price markers in sync with trades, including partial fills.',
        'Built resilient Selenium tooling (multi-strategy selectors, double-verified actions), encrypted session reuse with 2FA- and captcha-capable login, health checks and a systemd service for Ubuntu.',
      ],
    },
    {
      name: 'Geo-Availability QA Bot with OCR and Computer Vision',
      stack: 'Selenium, Tesseract OCR, OpenCV, AWS S3, Google Sheets',
      bullets: [
        'Built a bot that launches each catalogue game from 20 countries via geo-targeted remote browsers and classifies the outcome with DOM checks, Tesseract OCR and OpenCV SIFT matching, with screenshot evidence.',
      ],
    },
  ],

  alsoBuilt:
    'Creator subscription API with an OpenCV blur paywall and S3 delivery (FastAPI) · AI NDIS report generator (OpenAI, wkhtmltopdf) · fee-aware crypto arbitrage scanner across 6 exchanges (ccxt) · IG Markets streaming signal service (Lightstreamer, Flask-SocketIO) · economic-calendar ETL and API (cloudscraper, PostgreSQL) · EVM wallet onboarding API (BIP-39, eth-account) · PGA TOUR GraphQL data API.',

  education: [
    ['Intermediate', 'Karachi Board'],
    ['AIC: Artificial Intelligence', 'Presidential Initiative for Artificial Intelligence and Computing (PIAIC)'],
  ],
}
