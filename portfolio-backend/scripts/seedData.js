const mongoose = require('mongoose')
require('dotenv').config()

// Import models
const Project = require('../src/models/Project')
const Profile = require('../src/models/Profile')
const Internship = require('../src/models/Internship')

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing data
    await Project.deleteMany({})
    await Profile.deleteMany({})
    await Internship.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Seed Projects
    const projects = [
      {
        title: 'AI-powered Interview Platform',
        description: 'Practice interviews, analyze performance, and improve skills with AI-powered platform built using React and AI technologies.',
        image: '/imgs/ai_interview_platform.jpeg',
        githubLink: 'https://github.com/koushikshet2401/ai-mock-interview-site',
        liveLink: '',
        technologies: ['React', 'AI', 'MERN', 'Tailwind CSS'],
        featured: true,
        order: 1
      },
      {
        title: 'Hospital Management System',
        description: 'Comprehensive healthcare management solution with appointment scheduling, patient records, and billing system.',
        image: '/imgs/hospital_management.jpeg',
        githubLink: 'https://github.com/koushikshet2401/Medi-flow',
        liveLink: '',
        technologies: ['MERN', 'Stripe', 'Clerk', 'MongoDB'],
        featured: true,
        order: 2
      },
      {
        title: 'Real Estate Showcase',
        description: 'Modern real estate platform with interactive property listings, virtual tours, and advanced search filters.',
        image: '/imgs/real_estate.jpeg',
        githubLink: 'https://github.com/koushikshet2401/real-estate-shocase',
        liveLink: 'https://real-estate-shocase.vercel.app',
        technologies: ['React', 'MongoDB', 'Node.js', 'Express'],
        featured: true,
        order: 3
      },
      {
        title: 'Hostel Management System',
        description: 'Complete hostel administration system with room allocation, student management, and fee tracking.',
        image: '/imgs/hostel_management.jpeg',
        githubLink: 'https://github.com/koushikshet2401/hostel-management',
        liveLink: '',
        technologies: ['MERN', 'Express', 'MongoDB', 'React'],
        featured: false,
        order: 4
      },
      {
        title: 'Personal Portfolio Website',
        description: 'Modern portfolio showcasing projects, skills, and professional experience with smooth animations.',
        image: '/imgs/portfolio.jpeg',
        githubLink: 'https://github.com/koushikshet2401/portfolio',
        liveLink: 'https://koushikshet.vercel.app',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Three.js', 'Lenis'],
        featured: false,
        order: 5
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

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${projects.length} projects added`)
    console.log('   - 1 profile created')
    console.log(`   - ${internships.length} internships added`)
    console.log('\n✨ You can now start the server with: npm run dev')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run the seed function
seedDatabase()
