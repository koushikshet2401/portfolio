'use client'

import HeroScene3D from '../animations/HeroScene3D'

export default function Hero() {
  const handleScrollToProjects = (e) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && window.__goToPortfolioSection) {
      window.__goToPortfolioSection('projects')
      return
    }
    const target = document.getElementById('projects')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section
      className="section"
      style={{ borderBottom: '1px solid var(--surface-container-high)', padding: '4rem 0' }}
    >
      <div className="container">
        <div className="hero-grid">
          {/* Left Column */}
          <div className="hero-left">
            {/* Eyebrow */}
            <div className="hero-eyebrow">
              <span className="status-dot" style={{ flexShrink: 0 }}></span>
              <span>Full-Stack Developer / Backend Engineer</span>
            </div>

            {/* Headline */}
            <h1 className="hero-title">
              Building systems that make <span className="accent">complex things</span> feel simple.
            </h1>

            {/* Description */}
            <p className="hero-desc">
              I build AI-powered products, scalable backend systems, and real-time web experiences that solve practical problems with ruthless architectural clarity.
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <a
                className="btn-crimson"
                href="/resume/Koushik_DS_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
                  download
                </span>
                <span>Download Resume</span>
              </a>
              <a
                className="btn-outline"
                href="#projects"
                onClick={handleScrollToProjects}
              >
                <span>Explore My Work</span>
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
                  arrow_downward
                </span>
              </a>
            </div>

            {/* Status line */}
            <div className="hero-status-line">
              <span className="prompt">&gt;</span>
              <span>Currently: AI Intern @ Sash Info Services &nbsp;·&nbsp; RAG · Python · Node.js</span>
            </div>

            {/* Terminal */}
            <div className="hero-terminal">
              <div className="terminal-header">
                <span>koushik@system:~$ telemetry --identity</span>
                <span style={{ letterSpacing: '3px' }}>[ _ ] [ □ ] [ × ]</span>
              </div>
              <div className="terminal-body">
                <div>
                  <span className="prompt-sym">$</span> <span className="cmd">whoami</span>
                </div>
                <div style={{ paddingLeft: '1rem' }}>
                  Koushik D Shet <span style={{ color: 'var(--outline)' }}>— Karnataka, IN</span>
                </div>
                <div>
                  <span className="prompt-sym">$</span> <span className="cmd">focus</span>
                </div>
                <div style={{ paddingLeft: '1rem' }}>
                  Backend architecture, RAG pipelines, Event-driven systems
                </div>
                <div>
                  <span className="prompt-sym">$</span> <span className="cmd">status</span>
                </div>
                <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Available for opportunities...</span>
                  <span className="cursor-blink"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — 3D Panel */}
          <HeroScene3D />
        </div>
      </div>
    </section>
  )
}
