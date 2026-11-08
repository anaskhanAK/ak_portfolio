// Technology catalog. Only technologies with CORE or MEANINGFUL use in the projects, or listed
// on the resume, are included. Incidental dependencies are intentionally omitted.

export type TechGroupId = 'core' | 'agentic' | 'backend' | 'data' | 'ai' | 'automation' | 'markets' | 'integrations' | 'ops'

export const techGroups: { id: TechGroupId; label: string; blurb: string }[] = [
  { id: 'core', label: 'Languages & UI', blurb: 'What everything is written in.' },
  { id: 'agentic', label: 'Agentic AI & LLMs', blurb: 'Agents, tool calling and model APIs.' },
  { id: 'backend', label: 'Backend & APIs', blurb: 'Services, auth, real-time.' },
  { id: 'data', label: 'Data & storage', blurb: 'Where state lives.' },
  { id: 'ai', label: 'Machine learning & vision', blurb: 'Models and analysis used inside products.' },
  { id: 'automation', label: 'Automation & parsing', blurb: 'Getting data out of the world.' },
  { id: 'markets', label: 'Markets & Web3', blurb: 'Exchange, DEX and broker APIs.' },
  { id: 'integrations', label: 'Integrations', blurb: 'Payments, push, messaging, cloud.' },
  { id: 'ops', label: 'Delivery & ops', blurb: 'Running it for real.' },
]

/** `work`: how the resume says it was used at Tassaract; shown in the Stack section, linked to Experience. */
export type Tech = { id: string; name: string; group: TechGroupId; note?: string; work?: string }

export const techs: Tech[] = [
  { id: 'python', name: 'Python', group: 'core' },
  { id: 'javascript', name: 'JavaScript', group: 'core' },
  { id: 'sql', name: 'SQL', group: 'core' },
  { id: 'frontend', name: 'HTML, CSS & UI kits', group: 'core' },
  { id: 'react', name: 'React.js', group: 'core', work: 'Responsive front ends with HTML, CSS and JavaScript' },
  { id: 'streamlit', name: 'Streamlit', group: 'core' },

  { id: 'langgraph', name: 'LangGraph', group: 'agentic', work: 'Agentic AI systems and multi-agent workflows' },
  { id: 'langchain', name: 'LangChain', group: 'agentic' },
  { id: 'multiagent', name: 'Multi-agent systems', group: 'agentic', work: 'Multi-agent workflows built with LangGraph' },
  { id: 'openai', name: 'OpenAI API (GPT-4o)', group: 'agentic', work: 'LLM APIs (OpenAI, Groq) integrated into products, including chatbot features' },
  { id: 'groq', name: 'Groq', group: 'agentic', work: 'LLM APIs (OpenAI, Groq) integrated into products, including chatbot features' },
  { id: 'prompting', name: 'Prompt engineering', group: 'agentic' },
  { id: 'structured', name: 'Structured outputs (JSON Schema)', group: 'agentic' },
  { id: 'toolcalling', name: 'Tool calling', group: 'agentic' },
  { id: 'rag', name: 'RAG chatbots', group: 'agentic' },
  { id: 'speech', name: 'Speech AI', group: 'agentic' },

  { id: 'fastapi', name: 'FastAPI', group: 'backend' },
  { id: 'flask', name: 'Flask', group: 'backend' },
  { id: 'django', name: 'Django', group: 'backend', work: 'Full stack web applications, from database design to UI' },
  { id: 'sqlalchemy', name: 'SQLAlchemy + Alembic', group: 'backend' },
  { id: 'pydantic', name: 'Pydantic', group: 'backend' },
  { id: 'auth', name: 'JWT auth & RBAC', group: 'backend' },
  { id: 'realtime', name: 'Socket.IO & WebSockets', group: 'backend' },
  { id: 'graphql', name: 'GraphQL (client)', group: 'backend' },
  { id: 'express', name: 'Node.js / Express', group: 'backend', work: 'Full stack applications with Flask, Django, FastAPI, Node.js and React.js' },
  { id: 'celery', name: 'Celery', group: 'backend' },

  { id: 'postgresql', name: 'PostgreSQL', group: 'data' },
  { id: 'mysql', name: 'MySQL', group: 'data' },
  { id: 'sqlite', name: 'SQLite', group: 'data' },
  { id: 'pandas', name: 'pandas / NumPy', group: 'data', work: 'Data analysis with NumPy, Pandas and Matplotlib' },
  { id: 'vectordb', name: 'Pinecone & ChromaDB', group: 'data' },

  { id: 'ml', name: 'Machine learning', group: 'ai', work: 'ML projects from data analysis and model building to deployed models' },
  { id: 'pytorch', name: 'PyTorch', group: 'ai', work: 'Machine learning projects taken from data analysis to production web applications' },
  { id: 'sklearn', name: 'scikit-learn & SciPy', group: 'ai' },
  { id: 'viz', name: 'Matplotlib, Seaborn & Plotly', group: 'ai', work: 'Data analysis with NumPy, Pandas and Matplotlib' },
  { id: 'transformers', name: 'Hugging Face Transformers', group: 'ai' },
  { id: 'flair', name: 'Flair NLP', group: 'ai' },
  { id: 'opencv', name: 'OpenCV', group: 'ai' },
  { id: 'tesseract', name: 'Tesseract OCR', group: 'ai' },

  { id: 'selenium', name: 'Selenium', group: 'automation' },
  { id: 'scraping', name: 'Scraping & parsing', group: 'automation' },
  { id: 'email-pdf', name: 'IMAP & PDF parsing', group: 'automation' },
  { id: 'workers', name: 'Schedulers & workers', group: 'automation' },
  { id: 'reportlab', name: 'ReportLab (PDF export)', group: 'automation' },

  { id: 'ccxt', name: 'ccxt', group: 'markets' },
  { id: 'solana', name: 'Jupiter & Birdeye (Solana)', group: 'markets' },
  { id: 'ig', name: 'IG Markets + Lightstreamer', group: 'markets' },
  { id: 'evm', name: 'EVM wallets (BIP-39)', group: 'markets' },
  { id: 'chains', name: 'Ethereum, Polygon & Solana', group: 'markets' },

  { id: 'stripe', name: 'Stripe', group: 'integrations' },
  { id: 's3', name: 'AWS S3', group: 'integrations' },
  { id: 'fcm', name: 'Firebase Cloud Messaging', group: 'integrations' },
  { id: 'google', name: 'Google Sheets & Drive', group: 'integrations' },
  { id: 'telegram', name: 'Telegram Bot API', group: 'integrations' },
  { id: 'smtp', name: 'SMTP email', group: 'integrations' },
  { id: 'paypal', name: 'PayPal JS SDK', group: 'integrations' },

  { id: 'docker', name: 'Docker', group: 'ops', work: 'Applications containerized with Docker' },
  { id: 'aws', name: 'AWS (EC2, S3, RDS)', group: 'ops', work: 'Applications deployed on AWS (EC2, S3, RDS)' },
  { id: 'linux', name: 'Linux, systemd & Bash', group: 'ops' },
]

export const techById = Object.fromEntries(techs.map((t) => [t.id, t])) as Record<string, Tech>
