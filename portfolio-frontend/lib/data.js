// Centralized portfolio data repository
// This clean data layer enables future seamless API synchronization without UI rewrites.

export const portfolioData = {
  profile: {
    name: 'Koushik D Shet',
    monogram: 'koushik.dev',
    role: 'Full-Stack Developer / Backend Engineer',
    headline: 'Building systems that make complex things feel simple.',
    bio: 'I build AI-powered products, scalable backend systems, and real-time web experiences that solve practical problems with ruthless architectural clarity.',
    location: 'Karnataka, India · Open to Remote',
    email: 'Koushikshet2401@gmail.com',
    github: 'https://github.com/koushikshet2401',
    linkedin: 'https://www.linkedin.com/in/koushik-shet-7b228a353',
    instagram: 'https://instagram.com/koushik.110',
    resumeUrl: '/resume/Koushik_DS_CV.pdf',
    status: 'Open to opportunities',
    currentPosition: 'AI Intern @ Sash Info Services · RAG · Python · Node.js',
  },

  principles: [
    {
      num: '01 / Build with purpose',
      title: 'Pragmatic engineering over resume-driven complexity',
      desc: 'Every technology choice must defend its presence in the repository against operational overhead and latency budget constraints.',
    },
    {
      num: '02 / Engineer for reliability',
      title: 'Idempotent APIs, exponential backoffs, and dead letters',
      desc: 'Systems will fail. I design distributed tasks so they can retry gracefully, preserve causal order, and never duplicate transactions.',
    },
    {
      num: '03 / Keep learning through shipping',
      title: 'Mastery comes from deploying real code to real users',
      desc: 'Theoretical architecture means nothing until it experiences genuine load, atypical user edge cases, and unexpected network partitions.',
    },
  ],

  experiences: [
    {
      role: 'Web Developer Intern',
      current: true,
      company: 'Sash Info Services Pvt Ltd · Karnataka, IN',
      period: 'Mar 2026 — Present',
      bullets: [
        'Contributed to improving a document-based AI chatbot for the Indian Institute of Foreign Languages, handling complex institutional queries with RAG pipelines.',
        'Optimized the RAG retrieval pipeline by fine-tuning chunk size, top_k parameters, and similarity thresholds to significantly enhance response relevance.',
        'Implemented robust prompt control logic, intelligent fallback mechanisms, and advanced web crawling capabilities to process external data sources dynamically.',
      ],
      tech: ['Python', 'RAG', 'AI APIs', 'Web Crawling', 'LLMs'],
    },
    {
      role: 'AI Intern',
      current: false,
      company: 'FRIHBI Enterprises Pvt Ltd',
      period: 'Dec 2025 — Mar 2026',
      bullets: [
        'Contributed to backend development of a live Point of Sale (POS) system, improving transaction workflows in a production environment.',
        'Implemented and optimized comprehensive GST and tax calculation logic for accurate billing, reporting, and financial record-keeping.',
        'Enhanced critical checkout, discount application, and payment processing flows to ensure reliable, error-free transactions under high-volume conditions.',
      ],
      tech: ['Node.js', 'MongoDB', 'POS System', 'GST Logic'],
    },
    {
      role: 'Web Development Intern',
      current: false,
      company: 'JumpWhere',
      period: 'Aug 2025 — Oct 2025',
      bullets: [
        'Completed comprehensive training covering Internet Fundamentals, Web Architecture, Database & SQL, Programming Fundamentals, and Object-Oriented Programming.',
        'Built strong technical foundation through practical exercises and real-world assignments, developing problem-solving abilities and software development best practices.',
      ],
      tech: ['HTML/CSS', 'JavaScript', 'SQL', 'Python', 'DSA'],
    },
  ],

  projects: [
    {
      title: 'KnowBridge — AI-Powered Customer Support Platform',
      badges: ['AI / RAG', 'MULTI-TENANT'],
      githubUrl: 'https://github.com/koushikshet2401/KnowBridge',
      desc: 'A multi-tenant customer support platform featuring an embeddable React chat widget, real-time agent routing, retrieval-augmented generation (RAG), custom web crawling, and automated AI responses with fallback escalation.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'pgvector', 'OpenAI API', 'Socket.IO', 'Express.js'],
    },
    {
      title: 'WebhookHub — Resilient Webhook Delivery',
      badges: ['DISTRIBUTED SYSTEMS', 'RELIABILITY'],
      githubUrl: 'https://github.com/koushikshet2401/Webhookhub',
      desc: 'Self-hosted webhook delivery platform with HMAC-signed payloads, automatic retries with exponential backoff, dead-letter queue handling, and a live delivery telemetry dashboard.',
      tech: ['Node.js', 'Redis', 'BullMQ', 'MySQL'],
    },
    {
      title: 'Medi-Flow — Hospital Management System',
      badges: ['FULL-STACK', 'HEALTHCARE ERP'],
      githubUrl: 'https://github.com/koushikshet2401/Medi-Flow',
      desc: 'A comprehensive hospital management platform for managing patient records, doctor scheduling, multi-tier billing pipelines, and department resource allocation with Stripe payment integration.',
      tech: ['MERN', 'Stripe', 'Clerk'],
    },
    {
      title: 'AI Interview Platform',
      badges: ['AI / MERN', 'INTERVIEW PREP'],
      githubUrl: 'https://github.com/koushikshet2401/ai-mock-interview-site',
      desc: 'AI-powered platform for mock interview practice with real-time performance analysis, AI-generated questions tailored to role and experience level, and detailed feedback reports.',
      tech: ['React', 'Node.js', 'AI'],
    },
    {
      title: 'WhatsApp Ticketing System',
      badges: ['REAL-TIME', 'MESSAGING API'],
      githubUrl: 'https://github.com/koushikshet2401/WhatsApp-Ticketing-Management-System',
      desc: 'Real-time customer support system with WhatsApp Business API integration, automated ticket routing, agent assignment, and conversation threading.',
      tech: ['Node.js', 'WhatsApp API', 'Socket.IO'],
    },
    {
      title: 'AI Chat Platform',
      badges: ['MERN', 'AI / ANALYTICS'],
      githubUrl: 'https://github.com/koushikshet2401/AI-BOT',
      desc: 'MERN stack chatbot application with generative AI capabilities, conversation history, admin analytics dashboard, and user management system.',
      tech: ['MERN', 'OpenAI', 'Analytics'],
    },
    {
      title: 'AI Chrome Extension',
      badges: ['BROWSER EXTENSION', 'AI'],
      githubUrl: 'https://github.com/koushikshet2401/ai-chrome-extension',
      desc: 'Smart productivity enhancer browser extension powered by AI capabilities — content summarisation, page Q&A, and intelligent text assistance.',
      tech: ['JavaScript', 'Chrome API', 'AI'],
    },
  ],

  skills: [
    { title: 'Backend Development', skills: ['Node.js', 'Express.js', 'Socket.IO', 'REST APIs'] },
    { title: 'Architecture & Messaging', skills: ['Redis', 'BullMQ', 'Apache Kafka', 'Webhooks'] },
    { title: 'AI / ML', skills: ['RAG Pipelines', 'OpenAI API', 'pgvector', 'Prompt Engineering'] },
    { title: 'Frontend Development', skills: ['React', 'HTML', 'CSS', 'Tailwind CSS', 'JavaScript (ES6+)'] },
    { title: 'Database Management', skills: ['PostgreSQL', 'MongoDB', 'MySQL'] },
    { title: 'Languages', skills: ['JavaScript', 'TypeScript', 'Python', 'Java'] },
    { title: 'DevOps & Tools', skills: ['Docker', 'Git', 'GitHub', 'Postman', 'Cloudinary'] },
    { title: 'Cloud', skills: ['Microsoft Azure', 'Vercel', 'Render'] },
  ],

  certificates: [
    {
      title: 'Java Programming',
      issuer: 'Apna College',
      year: '2024',
      icon: 'fab fa-java',
      file: '/certificates/certificate-alpha-plus-batch-40-679cae7ac17cccfc8e0f1134.pdf',
    },
    {
      title: 'Full Stack Development',
      issuer: 'GeeksForGeeks',
      year: '2025',
      icon: 'fas fa-laptop-code',
      file: '/certificates/gfg full_stack.pdf',
    },
    {
      title: 'GFG 160 Days DSA',
      issuer: 'GeeksForGeeks',
      year: '2025',
      icon: 'fas fa-code',
      file: '/certificates/gfg160 days.pdf',
    },
  ],
}
