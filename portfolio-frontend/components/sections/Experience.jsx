'use client'

import { useState, useEffect } from 'react'
import { internshipsAPI } from '@/lib/api'

export default function Experience() {
  const [experiences, setExperiences] = useState(fallbackExperiences)

  useEffect(() => {
    let isMounted = true
    internshipsAPI.getAll()
      .then((res) => {
        if (!isMounted) return
        if (res.data?.data && res.data.data.length > 0) {
          const formatted = res.data.data.map((item) => ({
            _id: item._id,
            role: item.title,
            current: item.duration?.toLowerCase().includes('present'),
            company: item.company,
            period: item.duration,
            bullets: item.bullets && item.bullets.length > 0
              ? item.bullets
              : (item.descriptionDesktop
                  ? item.descriptionDesktop.split('. ').filter(Boolean).map((s) => (s.trim().endsWith('.') ? s : s + '.'))
                  : [item.descriptionMobile || ''].filter(Boolean)),
            tech: item.technologies || [],
          }))
          setExperiences(formatted)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Internships API notice (using fallback):', err.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="section" style={{ background: 'transparent' }}>
      <div className="container">
        <div className="section-ribbon">
          <span className="section-tag">02 // EXPERIENCE</span>
          <span className="section-line"></span>
        </div>
        <h2 className="section-title">Career &amp; Engineering Timeline</h2>
        <p className="section-subtitle">Real-world contributions across production systems and AI platforms.</p>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <div key={exp._id || index} className="timeline-item reveal visible">
              <div className={`timeline-dot ${exp.current ? '' : 'past'}`}></div>
              <div className="exp-card">
                <div className="exp-card-header">
                  <div>
                    <div className="exp-title-row">
                      <span className="exp-title">{exp.role}</span>
                      {exp.current && <span className="badge-current">CURRENT</span>}
                    </div>
                    <div className="exp-company">{exp.company}</div>
                  </div>
                  <div className="exp-date">{exp.period}</div>
                </div>

                <ul className="exp-bullets">
                  {exp.bullets.map((bullet, bIndex) => (
                    <li key={bIndex}>
                      <span className="bullet" aria-hidden="true">&gt;</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="tech-badges">
                  {exp.tech.map((t, tIndex) => (
                    <span key={tIndex} className="tech-badge">
                      {t}
                    </span>
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

const fallbackExperiences = [
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
]
