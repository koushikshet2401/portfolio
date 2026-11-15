'use client'

import { useState, useEffect } from 'react'
import { certificatesAPI, resolveAssetUrl } from '@/lib/api'

export default function Certificates() {
  const [certs, setCerts] = useState(fallbackCerts)

  useEffect(() => {
    let isMounted = true
    certificatesAPI.getAll()
      .then((res) => {
        if (!isMounted) return
        if (res.data?.data && res.data.data.length > 0) {
          setCerts(res.data.data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Certificates API notice (using fallback):', err.message)
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
          <span className="section-tag">05 // CERTIFICATIONS</span>
          <span className="section-line"></span>
        </div>
        <h2 className="section-title">Achievements &amp; Credentials</h2>
        <p className="section-subtitle">Verified learning milestones and course completions.</p>

        <div className="certs-grid">
          {certs.map((cert, index) => (
            <a
              key={cert._id || index}
              className="cert-card reveal visible"
              href={resolveAssetUrl(cert.file) || cert.credentialUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="cert-icon-box">
                <i className={cert.icon || 'fas fa-award'} aria-hidden="true"></i>
              </div>
              <div className="cert-info">
                <h3>{cert.title}</h3>
                <p>{cert.issuer}</p>
                <span className="cert-year">{cert.year}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

const fallbackCerts = [
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
]
