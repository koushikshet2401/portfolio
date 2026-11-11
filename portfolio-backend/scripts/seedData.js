const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const Project = require('../src/models/Project')
const Profile = require('../src/models/Profile')
const Internship = require('../src/models/Internship')
const Certificate = require('../src/models/Certificate')

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Project.deleteMany({})
    await Profile.deleteMany({})
    await Internship.deleteMany({})
    await Certificate.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed Projects (Matching actual production portfolio showcase)
    const projects = [
      {
        title: 'KnowBridge — AI-Powered Customer Support Platform',
        description: 'A multi-tenant customer support platform featuring an embeddable React chat widget, real-time agent routing, retrieval-augmented generation (RAG), custom web crawling, and automated AI responses with fallback escalation.',
        image: '/imgs/aiSupport-dark.png',
        githubLink: 'https://github.com/koushikshet2401/KnowBridge',
        liveLink: '',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'pgvector', 'OpenAI API', 'Socket.IO', 'Express.js'],
        badges: ['FLAGSHIP', 'AI / RAG', 'MULTI-TENANT'],
        featured: true,
        order: 1
      },
      {
        title: 'WebhookHub — Resilient Webhook Delivery',
        description: 'Self-hosted webhook delivery platform with HMAC-signed payloads, automatic retries with exponential backoff, dead-letter queue handling, and a live delivery telemetry dashboard.',
        image: '/imgs/webhookDark.png',
        githubLink: 'https://github.com/koushikshet2401/Webhookhub',
        liveLink: '',
        technologies: ['Node.js', 'Redis', 'BullMQ', 'MySQL'],
        badges: ['DISTRIBUTED SYSTEMS', 'RELIABILITY'],
        featured: false,
        order: 2
      },
      {
        title: 'Medi-Flow — Hospital Management System',
        description: 'A comprehensive hospital management platform for managing patient records, doctor scheduling, multi-tier billing pipelines, and department resource allocation with Stripe payment integration.',
        image: '/imgs/HospitalDark.jpeg',
        githubLink: 'https://github.com/koushikshet2401/Medi-Flow',
        liveLink: '',
        technologies: ['MERN', 'Stripe', 'Clerk', 'MongoDB'],
        badges: ['FULL-STACK', 'HEALTHCARE ERP'],
        featured: false,
        order: 3
      },
      {
        title: 'AI Interview Platform',
        description: 'AI-powered platform for mock interview practice with real-time performance analysis, AI-generated questions tailored to role and experience level, and detailed feedback reports.',
        image: '/imgs/AiInterviewDark.jpeg',
        githubLink: 'https://github.com/koushikshet2401/ai-mock-interview-site',
        liveLink: '',
        technologies: ['React', 'Node.js', 'AI', 'MERN'],
        badges: ['AI / MERN', 'INTERVIEW PREP'],
        featured: false,
        order: 4
      },
      {
        title: 'WhatsApp Ticketing System',
        description: 'Real-time customer support system with WhatsApp Business API integration, automated ticket routing, agent assignment, and conversation threading.',
        image: '/imgs/whatsapTicketDark.jpeg',
        githubLink: 'https://github.com/koushikshet2401/WhatsApp-Ticketing-Management-System',
        liveLink: '',
        technologies: ['Node.js', 'WhatsApp API', 'Socket.IO'],
        badges: ['REAL-TIME', 'MESSAGING API'],
        featured: false,
        order: 5
      },
      {
        title: 'AI Chat Platform',
        description: 'MERN stack chatbot application with generative AI capabilities, conversation history, admin analytics dashboard, and user management system.',
        image: '/imgs/aichatDark.jpeg',
        githubLink: 'https://github.com/koushikshet2401/AI-BOT',
        liveLink: '',
        technologies: ['MERN', 'OpenAI', 'Analytics'],
        badges: ['MERN', 'AI / ANALYTICS'],
        featured: false,
        order: 6
      },
      {
        title: 'AI Chrome Extension',
        description: 'Smart productivity enhancer browser extension powered by AI capabilities — content summarisation, page Q&A, and intelligent text assistance.',
        image: '/imgs/AiChromExtDark.jpeg',
        githubLink: 'https://github.com/koushikshet2401/ai-chrome-extension',
        liveLink: '',
        technologies: ['JavaScript', 'Chrome API', 'AI'],
        badges: ['BROWSER EXTENSION', 'AI'],
        featured: false,
        order: 7
      }
    ]

    await Project.insertMany(projects)
    console.log('✅ Projects seeded')

    // Seed Profile
    const profile = {
      name: 'Koushik Shet',
      title: 'Full Stack Developer | MERN Stack Specialist',
      bio: "I'm a dedicated web developer committed to creating intuitive, scalable digital solutions. With expertise in the MERN stack, I design seamless user experiences, write efficient code, and thrive in collaborative, fast-paced environments. Driven by problem-solving and continuous learning, I stay ahead of industry trends to build impactful applications.",
      email: 'koushikshet2401@gmail.com',
      phone: '+91 XXXXXXXXXX',
      location: 'Karnataka, India',
      resumeUrl: '/resume/Koushik_Resume.pdf',
      profileImage: '/imgs/gib.jpg',
      skills: {
        frontend: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'Bootstrap'],
        backend: ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST APIs'],
        tools: ['Python', 'Java', 'Git/GitHub', 'VS Code', 'Postman', 'Figma']
      },
      social: {
        linkedin: 'https://linkedin.com/in/koushik-shet',
        github: 'https://github.com/koushikshet2401',
        twitter: '',
        instagram: 'https://instagram.com/koushikshet.24'
      },
      stats: {
        projects: 5,
        internships: 2,
        efficiency: 100
      }
    }

    await Profile.create(profile)
    console.log('✅ Profile seeded')

    // Seed Internships
    const internships = [
      {
        title: 'Web Developer Intern',
        company: 'Sash Info Services Pvt Ltd',
        duration: 'Mar 2026 - Present',
        descriptionDesktop: 'Contributed to improving a document-based AI chatbot for the Indian Institute of Foreign Languages, handling complex institutional queries. Optimized the RAG retrieval pipeline by fine-tuning chunk size, top_k retrieval parameters, and similarity thresholds to significantly enhance response relevance. Implemented robust prompt control logic and intelligent fallback mechanisms to ensure responses remained strictly grounded in document context. Integrated advanced web crawling capabilities to fetch and process external data sources, substantially improving the chatbot\'s ability to handle dynamic and evolving queries.',
        descriptionMobile: 'Improved AI chatbot for institutional queries by optimizing RAG pipeline and implementing prompt control. Integrated web crawling for dynamic data processing.',
        technologies: ['Python', 'RAG', 'AI APIs', 'Web Crawling'],
        order: 1
      },
      {
        title: 'AI Intern',
        company: 'FRIHBI Enterprises Pvt Ltd',
        duration: 'Dec 2025 - Mar 2026',
        descriptionDesktop: 'Contributed to backend development of a live Point of Sale (POS) system, significantly improving transaction workflows in a production environment. Implemented and optimized comprehensive GST and tax calculation logic for accurate billing, reporting, and financial record-keeping. Enhanced critical checkout, discount application, and payment processing flows to ensure reliable, error-free transactions under high-volume conditions. Improved data validation mechanisms for employee and customer inputs, ensuring data accuracy and consistency across the entire system.',
        descriptionMobile: 'Developed backend for live POS system, implementing GST calculations and optimizing checkout flows. Enhanced data validation for reliable transactions.',
        technologies: ['Node.js', 'MongoDB', 'POS System'],
        order: 2
      },
      {
        title: 'Web Development Intern',
        company: 'JumpWhere',
        duration: 'Aug 2025 - Oct 2025',
        descriptionDesktop: 'Completed comprehensive internship training covering Internet Fundamentals, Technical Research Skills, Web Architecture, Database & SQL, Programming Fundamentals, Data Structures & Algorithms, Object-Oriented Programming, and Python Programming. Built a strong technical foundation through practical exercises and real-world assignments. Demonstrated dedication and consistency throughout the internship, successfully completing all assigned tasks under professional guidance while developing problem-solving abilities and understanding software development best practices.',
        descriptionMobile: 'Completed technical training in web fundamentals, databases, DSA, and Python. Built strong foundation through practical exercises and professional guidance.',
        technologies: ['HTML/CSS', 'JavaScript', 'SQL', 'Python'],
        order: 3
      }
    ]

    await Internship.insertMany(internships)
    console.log('✅ Internships seeded')

    // Seed Certificates
    const certificates = [
      {
        title: 'Java Programming',
        issuer: 'Apna College',
        year: '2024',
        icon: 'fab fa-java',
        file: '/certificates/certificate-alpha-plus-batch-40-679cae7ac17cccfc8e0f1134.pdf',
        order: 1
      },
      {
        title: 'Full Stack Development',
        issuer: 'GeeksForGeeks',
        year: '2025',
        icon: 'fas fa-laptop-code',
        file: '/certificates/gfg full_stack.pdf',
        order: 2
      },
      {
        title: 'GFG 160 Days DSA',
        issuer: 'GeeksForGeeks',
        year: '2025',
        icon: 'fas fa-code',
        file: '/certificates/gfg160 days.pdf',
        order: 3
      }
    ]

    await Certificate.insertMany(certificates)
    console.log('✅ Certificates seeded')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${projects.length} projects added`)
    console.log('   - 1 profile created')
    console.log(`   - ${internships.length} internships added`)
    console.log(`   - ${certificates.length} certificates added`)
    console.log('\n✨ You can now start the server with: npm run dev')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
