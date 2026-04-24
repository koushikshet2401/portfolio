'use client'

export default function Certificates() {
  const certificates = [
    {
      title: 'Full Stack Web Development',
      issuer: 'Next Gen Invent',
      date: 'January 2025',
      icon: 'fas fa-code',
      color: '#667eea',
      link: '/certificates/certificate-alpha-plus-batch-40-679cae7ac17cccfc8e0f1134.pdf',
      badge: 'Full Stack'
    },
    {
      title: 'GFG Full Stack Development',
      issuer: 'GeeksForGeeks',
      date: '2024',
      icon: 'fas fa-laptop-code',
      color: '#10b981',
      link: '/certificates/gfg full_stack.pdf',
      badge: 'Full Stack'
    },
    {
      title: 'GFG 160 Days of DSA',
      issuer: 'GeeksForGeeks',
      date: '2024',
      icon: 'fas fa-brain',
      color: '#f59e0b',
      link: '/certificates/gfg160 days.pdf',
      badge: 'DSA'
    }
  ]

  return (
    <section id="certificates" className="section certificates">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Achievements</span>
          <h2 className="section-title">Certifications</h2>
        </div>

        <div className="certificates-grid">
          {certificates.map((cert, index) => (
            <div key={index} className="certificate-card" data-tilt>
              {/* Icon banner */}
              <div className="cert-banner" style={{ background: `linear-gradient(135deg, ${cert.color}22, ${cert.color}44)`, borderBottom: `2px solid ${cert.color}33` }}>
                <div className="cert-icon-wrap" style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.color}cc)` }}>
                  <i className={cert.icon} style={{ color: '#fff', fontSize: '2rem' }}></i>
                </div>
                <span className="cert-badge" style={{ background: cert.color }}>{cert.badge}</span>
              </div>

              {/* Content */}
              <div className="certificate-content">
                <h3>{cert.title}</h3>
                <p className="issuer">
                  <i className="fas fa-building" style={{ marginRight: '6px', color: cert.color }}></i>
                  {cert.issuer}
                </p>
                <p className="date">
                  <i className="fas fa-calendar-alt" style={{ marginRight: '6px', color: cert.color }}></i>
                  {cert.date}
                </p>
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-view-btn"
                  style={{ borderColor: cert.color, color: cert.color }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = cert.color
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = cert.color
                  }}
                >
                  <i className="fas fa-file-pdf"></i> View Certificate
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
