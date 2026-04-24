'use client'

import { useState, useEffect } from 'react'
import { projectsAPI } from '@/lib/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll()
      setProjects(response.data.data)
    } catch (error) {
      console.error('Failed to load projects:', error)
      // Fallback to static data
      setProjects(getStaticProjects())
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="projects" className="section projects">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>
          <div className="loading">Loading projects...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Portfolio</span>
          <h2 className="section-title">Featured Projects</h2>
        </div>
        
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id || project.id} className="project-card" data-tilt>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  {project.liveLink && (
                    <a 
                      href={project.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Fallback static data
function getStaticProjects() {
  return [
    {
      id: '1',
      title: 'AI-powered Interview Platform',
      description: 'Practice interviews, analyze performance, and improve skills with AI-powered platform.',
      image: '/imgs/ai_interview_platform.jpeg',
      githubLink: 'https://github.com/koushikshet2401/ai-mock-interview-site',
      liveLink: '',
      technologies: ['React', 'AI', 'MERN']
    },
    {
      id: '2',
      title: 'Hospital Management System',
      description: 'Comprehensive healthcare management solution with appointment scheduling and patient records.',
      image: '/imgs/medicalReport.jpg',
      githubLink: 'https://github.com/koushikshet2401/Medi-flow',
      liveLink: '',
      technologies: ['MERN', 'Stripe', 'Clerk']
    },
    {
      id: '3',
      title: 'Real Estate Showcase',
      description: 'Modern real estate platform with interactive property listings and virtual tours.',
      image: '/imgs/wht.jpeg',
      githubLink: 'https://github.com/koushikshet2401/real-estate-shocase',
      liveLink: 'https://real-estate-shocase.vercel.app',
      technologies: ['React', 'MongoDB', 'Node.js']
    },
    {
      id: '4',
      title: 'Hostel Management',
      description: 'Complete hostel administration system with room allocation and student management.',
      image: '/imgs/enqSystem.png',
      githubLink: 'https://github.com/koushikshet2401/hostel-management',
      liveLink: '',
      technologies: ['MERN', 'Express', 'MongoDB']
    },
    {
      id: '5',
      title: 'Portfolio Website',
      description: 'Personal portfolio showcasing projects, skills, and professional experience.',
      image: '/imgs/gibliii.png',
      githubLink: 'https://github.com/koushikshet2401/portfolio',
      liveLink: 'https://koushikshet.vercel.app',
      technologies: ['HTML', 'CSS', 'JavaScript']
    }
  ]
}
