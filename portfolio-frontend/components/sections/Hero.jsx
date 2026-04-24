'use client'

import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const [counts, setCounts] = useState({ projects: 0, internships: 0, efficiency: 0 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        animateCounter('projects', 5)
        animateCounter('internships', 2)
        animateCounter('efficiency', 100)
      }
    }, { threshold: 0.5 })

    const heroSection = document.getElementById('home')
    if (heroSection) observer.observe(heroSection)

    return () => observer.disconnect()
  }, [])

  const animateCounter = (key, target) => {
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0

    const update = () => {
      current += step
      if (current < target) {
        setCounts(prev => ({ ...prev, [key]: Math.floor(current) }))
        requestAnimationFrame(update)
      } else {
        setCounts(prev => ({ ...prev, [key]: target }))
      }
    }

    update()
  }

  return (
    <section id="home" className="hero">
      <div className="hero-bg-animation"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-label animate-slide-up">
              <span className="pulse-dot"></span>
              Available for opportunities
            </div>
            
            <h1 className="hero-title">
              <span className="line animate-slide-up">Hi, I&apos;m</span>
              <span className="line animate-slide-up gradient-text">Koushik Shet</span>
            </h1>
            
            <p className="hero-subtitle animate-slide-up">
              Full Stack Developer | MERN Stack Specialist
            </p>
            
            <div className="hero-stats animate-slide-up">
              <div className="stat-item">
                <span className="stat-num counter" data-target="5">{counts.projects}</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-num counter" data-target="2">{counts.internships}</span>
                <span className="stat-label">Internships</span>
              </div>
              <div className="stat-item">
                <span className="stat-num counter" data-target="100">{counts.efficiency}%</span>
                <span className="stat-label">Efficiency</span>
              </div>
            </div>
            
            <div className="hero-buttons animate-slide-up">
              <a href="/resume/Koushik_shet_CV_02.pdf" className="btn btn-primary" target="_blank">
                <span>Download Resume</span>
                <i className="fas fa-download"></i>
              </a>
              <a href="#projects" className="btn btn-secondary">
                <span>View Projects</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
          
          <div className="hero-image animate-fade-in">
            <div className="profile-container">
              <div className="profile-ring"></div>
              <div className="profile-ring"></div>
              <img src="/imgs/gib.jpg" alt="Koushik Shet" className="profile-img" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
      </div>
    </section>
  )
}
