'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleSectionChange = (e) => {
      if (e.detail) {
        setActiveSection(e.detail)
      }
    }

    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'stack', 'certificates', 'contact']
      const scrollPos = window.scrollY + 140

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i]
        const element = document.getElementById(id)
        if (element && element.offsetTop <= scrollPos) {
          setActiveSection(id)
          break
        }
      }
    }

    window.addEventListener('portf:sectionChange', handleSectionChange)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('portf:sectionChange', handleSectionChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLinkClick = (e, href) => {
    setIsMobileOpen(false)
    if (href.startsWith('#')) {
      e.preventDefault()
      const targetId = href.replace('#', '')
      if (typeof window !== 'undefined' && window.__goToPortfolioSection) {
        window.__goToPortfolioSection(targetId)
      } else {
        window.dispatchEvent(new CustomEvent('portf:goto', { detail: targetId }))
      }
    }
  }

  return (
    <>
      <header className="navbar" id="navbar">
        <div className="nav-inner">
          {/* Brand */}
          <div className="nav-brand">
            <a
              className="nav-monogram"
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              data-path="home"
            >
              koushik.dev
            </a>
            <div className="nav-status">
              <span className="status-dot"></span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'var(--secondary-text)',
                }}
              >
                Open to opportunities
              </span>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="nav-links" id="navLinks">
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              data-section="home"
              onClick={(e) => handleLinkClick(e, '#home')}
            >
              About
            </a>
            <a
              href="#experience"
              className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
              data-section="experience"
              onClick={(e) => handleLinkClick(e, '#experience')}
            >
              Experience
            </a>
            <a
              href="#projects"
              className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
              data-section="projects"
              onClick={(e) => handleLinkClick(e, '#projects')}
            >
              Projects
            </a>
            <a
              href="#stack"
              className={`nav-link ${activeSection === 'stack' ? 'active' : ''}`}
              data-section="stack"
              onClick={(e) => handleLinkClick(e, '#stack')}
            >
              Stack
            </a>
            <a
              href="#certificates"
              className={`nav-link ${activeSection === 'certificates' ? 'active' : ''}`}
              data-section="certificates"
              onClick={(e) => handleLinkClick(e, '#certificates')}
            >
              Certs
            </a>
            <a
              href="#contact"
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              data-section="contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
            >
              Contact
            </a>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <ThemeToggle id="themeToggle" />
            <a
              className="nav-github-btn"
              href="https://github.com/koushikshet2401"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <i className="fab fa-github" style={{ fontSize: '14px' }}></i>
              <span>GitHub</span>
            </a>
            <button
              className={`hamburger ${isMobileOpen ? 'active' : ''}`}
              id="hamburger"
              aria-label="Toggle menu"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${isMobileOpen ? 'open' : ''}`} id="mobileNav">
        <div className="mobile-theme-row">
          <span className="mobile-theme-label">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              palette
            </span>{' '}
            Theme
          </span>
          <ThemeToggle id="mobileThemeToggle" />
        </div>
        <a
          href="#home"
          className="nav-link"
          id="mn-home"
          onClick={(e) => handleLinkClick(e, '#home')}
        >
          Home
        </a>
        <a
          href="#experience"
          className="nav-link"
          id="mn-exp"
          onClick={(e) => handleLinkClick(e, '#experience')}
        >
          Experience
        </a>
        <a
          href="#projects"
          className="nav-link"
          id="mn-proj"
          onClick={(e) => handleLinkClick(e, '#projects')}
        >
          Projects
        </a>
        <a
          href="#stack"
          className="nav-link"
          id="mn-stack"
          onClick={(e) => handleLinkClick(e, '#stack')}
        >
          Stack
        </a>
        <a
          href="#certificates"
          className="nav-link"
          id="mn-certs"
          onClick={(e) => handleLinkClick(e, '#certificates')}
        >
          Certs
        </a>
        <a
          href="#contact"
          className="nav-link"
          id="mn-contact"
          onClick={(e) => handleLinkClick(e, '#contact')}
        >
          Contact
        </a>
        <a
          href="https://github.com/koushikshet2401"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link"
          id="mn-github"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson)' }}
        >
          <i className="fab fa-github"></i>
          <span>GitHub Profile</span>
        </a>
      </div>
    </>
  )
}
