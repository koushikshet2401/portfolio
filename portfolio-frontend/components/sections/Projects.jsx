'use client'

import { useState, useEffect, useRef } from 'react'
import { projectsAPI } from '@/lib/api'
import { tracker } from '@/lib/tracking'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    projectsAPI.getAll()
      .then((res) => {
        if (!isMounted) return
        if (res.data?.data && res.data.data.length > 0) {
          setProjects(res.data.data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Projects API request notice (using fallback):', err.message)
        }
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Viewport Dwell Time Tracking for project attention metrics
  useEffect(() => {
    if (!containerRef.current || !tracker) return

    const cardElements = containerRef.current.querySelectorAll('[data-proj-title]')
    if (!cardElements || cardElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.dataset.projId
          const title = entry.target.dataset.projTitle
          if (!title) return

          if (entry.isIntersecting) {
            tracker.startProjectDwell(id, title)
          } else {
            tracker.endProjectDwell(id, title)
          }
        })
      },
      { threshold: 0.45 }
    )

    cardElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      cardElements.forEach((el) => {
        const id = el.dataset.projId
        const title = el.dataset.projTitle
        if (title) tracker.endProjectDwell(id, title)
      })
    }
  }, [projects])

  const handleTiltMove = (e) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const maxTilt = 6

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`
  }

  const handleTiltLeave = (e) => {
    e.currentTarget.style.transform = ''
  }

  return (
    <section className="section" style={{ background: 'transparent' }}>
      <div className="container" ref={containerRef}>
        <div className="section-ribbon">
          <span className="section-tag">03 // PROJECTS</span>
          <span className="section-line"></span>
        </div>
        <h2 className="section-title">Selected work. Real engineering.</h2>
        <p className="section-subtitle">
          Production systems built for multi-tenancy, high-volume event delivery, and low-latency retrieval.
        </p>

        {/* Projects Grid (All projects rendered equally with no oversized flagship) */}
        <div className="projects-grid">
          {(projects.length > 0 ? projects : fallbackGridProjects).map((project, idx) => (
            <div
              key={project._id || idx}
              className="project-card reveal visible"
              data-proj-id={project._id || `proj-${idx}`}
              data-proj-title={project.title}
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
            >
              <div>
                <div className="project-card-header">
                  <div>
                    <div className="project-badges" style={{ marginBottom: '0.375rem' }}>
                      {project.badges && project.badges.length > 0 ? (
                        project.badges.filter(b => b !== 'FLAGSHIP').map((b, i) => (
                          <span key={i} className="badge-tag">{b}</span>
                        ))
                      ) : (
                        <span className="badge-tag">{project.technologies?.[0] || 'ENGINEERING'}</span>
                      )}
                    </div>
                  </div>
                  <a
                    className="icon-link"
                    href={project.githubLink || project.liveLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} Link`}
                    onClick={() => tracker?.trackProjectClick(project._id, project.title, project.githubLink ? 'github_click' : 'live_demo_click', project.githubLink || project.liveLink)}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '20px' }}>
                      open_in_new
                    </span>
                  </a>
                </div>

                <div className="project-card-title">{project.title}</div>
                <div className="project-card-desc">{project.description}</div>

                {/* Telemetry / preview if available */}
                {renderProjectPreview(project)}
              </div>

              <div className="project-card-footer">
                <div className="tech-badges">
                  {project.technologies?.slice(0, 4).map((tech, tIdx) => (
                    <span key={tIdx} className="tech-badge">{tech}</span>
                  ))}
                </div>
                <a
                  className="project-link-text"
                  href={project.githubLink || project.liveLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => tracker?.trackProjectClick(project._id, project.title, 'card_click', project.githubLink || project.liveLink)}
                >
                  Inspect →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Helper to render customized engineering previews
function renderProjectPreview(project) {
  const title = project.title?.toLowerCase() || ''

  if (title.includes('knowbridge')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>AI_ROUTER // pgvector</span>
          <span style={{ color: 'var(--on-surface)' }}>LATENCY: 42ms</span>
        </div>
        <div className="preview-row">
          <span>Retrieval Score (top-1)</span>
          <span className="preview-status active">0.912</span>
        </div>
        <div className="preview-row">
          <span>Socket Widget Status</span>
          <span className="preview-status">CONNECTED</span>
        </div>
      </div>
    )
  }

  if (title.includes('webhook')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>QUEUE: dispatch-worker-04</span>
          <span style={{ color: 'var(--on-surface)' }}>CONCURRENCY: 25</span>
        </div>
        <div className="preview-row">
          <span>evt_94301 (customer.charge)</span>
          <span className="preview-status">200 OK · 18ms</span>
        </div>
        <div className="preview-row">
          <span>evt_94302 (invoice.created)</span>
          <span className="preview-status active">RETRY_2 · 429</span>
        </div>
        <div className="preview-row">
          <span>evt_94303 (order.refunded)</span>
          <span className="preview-status">200 OK · 24ms</span>
        </div>
      </div>
    )
  }

  if (title.includes('hospital') || title.includes('medi-flow')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>SYSTEM: ward-occupancy-engine</span>
          <span style={{ color: 'var(--on-surface)' }}>AGGREGATE: 84%</span>
        </div>
        <div>
          <div className="preview-row">
            <span>Cardiology Ward</span>
            <span>92%</span>
          </div>
          <div className="preview-bar">
            <div className="preview-bar-fill" style={{ width: '92%' }}></div>
          </div>
        </div>
        <div style={{ marginTop: '6px' }}>
          <div className="preview-row">
            <span>Orthopedics</span>
            <span>76%</span>
          </div>
          <div className="preview-bar">
            <div className="preview-bar-fill" style={{ width: '76%' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (title.includes('interview')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>SESSION: mock-interview-04</span>
          <span style={{ color: 'var(--on-surface)' }}>AI: ACTIVE</span>
        </div>
        <div className="preview-row">
          <span>Communication</span>
          <span style={{ color: 'var(--crimson)' }}>87%</span>
        </div>
        <div className="preview-bar">
          <div className="preview-bar-fill" style={{ width: '87%' }}></div>
        </div>
        <div className="preview-row" style={{ marginTop: '6px' }}>
          <span>Technical Depth</span>
          <span style={{ color: 'var(--crimson)' }}>79%</span>
        </div>
        <div className="preview-bar">
          <div className="preview-bar-fill" style={{ width: '79%' }}></div>
        </div>
      </div>
    )
  }

  if (title.includes('whatsapp')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>QUEUE: support-tickets</span>
          <span style={{ color: 'var(--on-surface)' }}>OPEN: 14</span>
        </div>
        <div className="preview-row">
          <span>TKT-0091 · billing query</span>
          <span className="preview-status active">ASSIGNED</span>
        </div>
        <div className="preview-row">
          <span>TKT-0090 · login issue</span>
          <span className="preview-status">RESOLVED</span>
        </div>
      </div>
    )
  }

  if (title.includes('chat') || title.includes('bot')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>ANALYTICS: sessions-today</span>
          <span style={{ color: 'var(--on-surface)' }}>ACTIVE: 31</span>
        </div>
        <div className="preview-row">
          <span>Avg Session Length</span>
          <span style={{ color: 'var(--crimson)' }}>8.4 min</span>
        </div>
        <div className="preview-row">
          <span>AI Response Accuracy</span>
          <span style={{ color: 'var(--crimson)' }}>94%</span>
        </div>
      </div>
    )
  }

  if (title.includes('chrome') || title.includes('extension')) {
    return (
      <div className="project-card-preview">
        <div className="preview-header">
          <span>EXTENSION: ai-assistant-v2</span>
          <span style={{ color: 'var(--on-surface)' }}>STATUS: ACTIVE</span>
        </div>
        <div className="preview-row">
          <span>Pages Summarized</span>
          <span style={{ color: 'var(--crimson)' }}>240+</span>
        </div>
        <div className="preview-row">
          <span>Avg Summary Time</span>
          <span style={{ color: 'var(--crimson)' }}>1.2s</span>
        </div>
      </div>
    )
  }

  // Generic clean preview
  return (
    <div className="project-card-preview">
      <div className="preview-header">
        <span>STATUS: PRODUCTION</span>
        <span style={{ color: 'var(--on-surface)' }}>ENGINEERED</span>
      </div>
      <div className="preview-row">
        <span>Repository:</span>
        <span className="preview-status">ONLINE</span>
      </div>
    </div>
  )
}

// Fallback if offline
const fallbackGridProjects = [
  {
    title: 'KnowBridge — AI-Powered Customer Support Platform',
    description: 'A multi-tenant customer support platform featuring an embeddable React chat widget, real-time agent routing, retrieval-augmented generation (RAG), custom web crawling, and automated AI responses with fallback escalation.',
    githubLink: 'https://github.com/koushikshet2401/KnowBridge',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'pgvector', 'OpenAI API', 'Socket.IO'],
    badges: ['AI / RAG', 'MULTI-TENANT']
  },
  {
    title: 'WebhookHub — Resilient Webhook Delivery',
    description: 'Self-hosted webhook delivery platform with HMAC-signed payloads, automatic retries with exponential backoff, dead-letter queue handling, and a live delivery telemetry dashboard.',
    githubLink: 'https://github.com/koushikshet2401/Webhookhub',
    technologies: ['Node.js', 'Redis', 'BullMQ', 'MySQL'],
    badges: ['DISTRIBUTED SYSTEMS', 'RELIABILITY']
  },
  {
    title: 'Medi-Flow — Hospital Management System',
    description: 'A comprehensive hospital management platform for managing patient records, doctor scheduling, multi-tier billing pipelines, and department resource allocation with Stripe payment integration.',
    githubLink: 'https://github.com/koushikshet2401/Medi-Flow',
    technologies: ['MERN', 'Stripe', 'Clerk', 'MongoDB'],
    badges: ['FULL-STACK', 'HEALTHCARE ERP']
  },
  {
    title: 'AI Interview Platform',
    description: 'AI-powered platform for mock interview practice with real-time performance analysis, AI-generated questions tailored to role and experience level, and detailed feedback reports.',
    githubLink: 'https://github.com/koushikshet2401/ai-mock-interview-site',
    technologies: ['React', 'Node.js', 'AI', 'MERN'],
    badges: ['AI / MERN', 'INTERVIEW PREP']
  },
  {
    title: 'WhatsApp Ticketing System',
    description: 'Real-time customer support system with WhatsApp Business API integration, automated ticket routing, agent assignment, and conversation threading.',
    githubLink: 'https://github.com/koushikshet2401/WhatsApp-Ticketing-Management-System',
    technologies: ['Node.js', 'WhatsApp API', 'Socket.IO'],
    badges: ['REAL-TIME', 'MESSAGING API']
  },
  {
    title: 'AI Chat Platform',
    description: 'MERN stack chatbot application with generative AI capabilities, conversation history, admin analytics dashboard, and user management system.',
    githubLink: 'https://github.com/koushikshet2401/AI-BOT',
    technologies: ['MERN', 'OpenAI', 'Analytics'],
    badges: ['MERN', 'AI / ANALYTICS']
  },
  {
    title: 'AI Chrome Extension',
    description: 'Smart productivity enhancer browser extension powered by AI capabilities — content summarisation, page Q&A, and intelligent text assistance.',
    githubLink: 'https://github.com/koushikshet2401/ai-chrome-extension',
    technologies: ['JavaScript', 'Chrome API', 'AI'],
    badges: ['BROWSER EXTENSION', 'AI']
  }
]
