// Resume text, copied from public/Anas_Khan_Resume.pdf. The site reads its title, summary, skills,
// roles and education from here, so editing this file (and replacing the PDF) keeps both in sync.

export const resume = {
  name: 'Anas Khan',
  title: 'Full Stack ML Engineer · Full Stack ML Engineer',

  summary:
    'Full Stack ML Engineer with 5+ years of experience at Tassaract, where I moved up from Full Stack Developer to Full Stack ML Engineer and now lead a Python and AI team. I build complete web applications with Python (Django, Flask, FastAPI) and React.js, containerized with Docker and deployed on AWS. I design and ship machine learning and agentic AI systems, including multi-agent workflows built with LangGraph, and integrate LLM features into business applications. Comfortable owning a project end to end, from architecture to code to leading the people who build it.',

  skills: [
    ['Languages', 'Python, JavaScript (ES6+), HTML5, CSS3'],
    [
      'Agentic AI & LLMs',
      'LangGraph, LangChain, Multi-Agent Systems, OpenAI API (GPT-4o), Groq, Prompt Engineering, Structured Outputs (JSON Schema), Tool Calling, RAG Chatbots, Speech AI',
    ],
    ['ML & Data', 'NumPy, Pandas, Scikit-learn, SciPy, PyTorch, Matplotlib, Seaborn, Plotly'],
    ['Backend', 'Django, Flask, FastAPI, Node.js, Express.js, REST APIs, JWT Auth, Celery, SQLAlchemy, Pydantic'],
    ['Frontend', 'React.js, Streamlit, Responsive Design'],
    ['Automation & Web3', 'Web Scraping (BeautifulSoup, Selenium), Bot Development, Ethereum, Polygon, Solana'],
    ['Databases', 'PostgreSQL, MySQL, SQLite, Pinecone (Vector DB), ChromaDB (Vector DB)'],
    ['Cloud & DevOps', 'Docker, AWS (EC2, S3, RDS)'],
  ] as [string, string][],

  experience: [
    {
      title: 'ML/AI Team Lead',
      org: 'Tassaract',
      dates: '2024 - Present',
      bullets: [
        'Leading a team of Python and AI developers: project planning, task breakdowns, code reviews and on-time delivery.',
        'Designing and building full stack applications with Flask, Django, FastAPI, Node.js and React.js, containerized with Docker and deployed on AWS (EC2, S3, RDS).',
        'Building agentic AI systems and multi-agent workflows with LangGraph, and integrating LLM APIs (OpenAI, Groq) into products, including chatbot features.',
        'Using NumPy, Pandas and Matplotlib for data analysis and working with the team on machine learning models used in real business applications.',
        'Overseeing automation, web scraping and arbitrage bot projects, and mentoring junior developers.',
      ],
    },
    {
      title: 'Full Stack ML Engineer',
      org: 'Tassaract',
      dates: '2021 - 2024',
      bullets: [
        'Built full stack web applications with Python (Flask, Django), FastAPI and Node.js APIs and React.js, packaged with Docker.',
        'Wrote web scraping and automation scripts and bots, including early arbitrage bots, cutting down manual data entry.',
        'Built a chatbot using OpenAI’s API to handle common customer and internal queries automatically.',
        'Delivered machine learning projects from data analysis to model deployment, and worked on blockchain wallet integration and on-chain transactions.',
      ],
    },
    {
      title: 'Full Stack Developer',
      org: 'Tassaract',
      dates: '2019 - 2021',
      bullets: [
        'Built web applications with Python (Flask, Django) and front-end pages with React.js, HTML, CSS and JavaScript.',
        'Wrote my first automation bots and scraping scripts, and assisted with early blockchain experiments; earned two promotions.',
      ],
    },
  ],

  education: [
    ['Intermediate', 'Karachi Board'],
    ['AIC: Artificial Intelligence', 'Presidential Initiative for AI and Computing (PIAIC)'],
  ] as [string, string][],
}
