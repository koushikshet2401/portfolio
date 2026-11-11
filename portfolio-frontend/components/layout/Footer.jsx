'use client'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-socials">
          <a
            className="footer-social-link"
            href="https://www.linkedin.com/in/koushik-shet-7b228a353"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a
            className="footer-social-link"
            href="https://github.com/koushikshet2401"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            className="footer-social-link"
            href="https://instagram.com/koushik.110"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            className="footer-social-link"
            href="mailto:KoushikShet2401@gmail.com"
            aria-label="Email"
          >
            <i className="fas fa-envelope"></i>
          </a>
        </div>
        <p className="footer-copy">
          © 2025 Koushik Shet &nbsp;·&nbsp; Crafted with <span className="heart">♥</span> &nbsp;·&nbsp;{' '}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--crimson)' }}>
            Node.js · React · PostgreSQL
          </span>
        </p>
      </div>
    </footer>
  )
}
