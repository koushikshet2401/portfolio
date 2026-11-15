'use client'

import { useState, useEffect } from 'react'
import { Palette } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

function mapToNavSection(sectionId) {
  if (sectionId === 'activity') return 'home'
  return sectionId || 'home'
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleSectionChange = (e) => {
      if (e.detail) {
        setActiveSection(mapToNavSection(e.detail))
      }
    }

    const handleScroll = () => {
      const sections = ['home', 'experience', 'projects', 'stack', 'certificates', 'contact']
      const centerLine = window.innerHeight * 0.4

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i]
        const el = document.getElementById(id)
        if (!el) continue
        // Use unpinned .pin-spacer wrapper if present so position:fixed does not skew top
        const flowEl = el.parentElement?.classList?.contains('pin-spacer') ? el.parentElement : el
        const rect = flowEl.getBoundingClientRect()
        if (rect.top <= centerLine) {
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
      setActiveSection(mapToNavSection(targetId))
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
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  fontSize: '0.6rem',
                  color: 'var(--secondary-text)',
                }}
              >
                Open to opportunities
              </span>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="nav-links" id="navLinks" aria-label="Main navigation">
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              data-section="home"
              onClick={(e) => handleLinkClick(e, '#home')}
            >
              Home
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
              <i className="fab fa-github" aria-hidden="true" style={{ fontSize: '14px' }}></i>
              <span>GitHub</span>
            </a>
            <button
              type="button"
              className={`hamburger ${isMobileOpen ? 'active' : ''}`}
              id="hamburger"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              aria-controls="mobileNav"
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
          <span className="mobile-theme-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
            <Palette size={16} aria-hidden="true" />
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
          onClick={() => setIsMobileOpen(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--crimson)' }}
        >
          <i className="fab fa-github" aria-hidden="true"></i>
          <span>GitHub Profile</span>
        </a>
      </div>
    </>
  )
}
