'use client'

export default function Certificates() {
  const certificates = [
    {
      title: 'Full Stack Web Development',
      issuer: 'Next Gen Invent',
      date: 'January 2025',
      image: '/certificates/ngi_certificate.jpg',
      link: '/certificates/ngi_certificate.jpg'
    },
    {
      title: 'Web Development Internship',
      issuer: 'CodSoft',
      date: 'September 2024',
      image: '/certificates/codsoft_certificate.jpg',
      link: '/certificates/codsoft_certificate.jpg'
    },
    {
      title: 'Python Programming',
      issuer: 'Great Learning',
      date: 'March 2024',
      image: '/certificates/python_certificate.jpg',
      link: '/certificates/python_certificate.jpg'
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
              <div className="certificate-image">
                <img src={cert.image} alt={cert.title} />
                <div className="certificate-overlay">
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="view-btn"
                  >
                    <i className="fas fa-eye"></i> View
                  </a>
                </div>
              </div>
              <div className="certificate-content">
                <h3>{cert.title}</h3>
                <p className="issuer">{cert.issuer}</p>
                <p className="date">{cert.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
