'use client'

import { useState } from 'react'
import { messagesAPI } from '@/lib/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'fallback'
  const [statusMessage, setStatusMessage] = useState('Send Message')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, subject, message } = formData

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before sending.')
      return
    }

    setStatus('sending')
    setStatusMessage('Sending...')

    let sent = false

    // Attempt 0: If backend is available, also log to backend
    try {
      if (process.env.NEXT_PUBLIC_API_URL) {
        messagesAPI.create({ name, email, subject, message }).catch(() => {})
      }
    } catch (e) {}

    // Attempt 1: Direct delivery via FormSubmit
    try {
      const res = await fetch('https://formsubmit.co/ajax/koushikshet2401@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          _subject: `New Portfolio Message: ${subject} from ${name}`,
          message,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json()
      if (res.ok || data.success === 'true' || data.message) {
        sent = true
      }
    } catch (fsErr) {
      console.warn('FormSubmit attempt failed, trying fallback:', fsErr)
    }

    // Attempt 2: EmailJS fallback
    if (!sent && typeof window !== 'undefined' && window.emailjs) {
      try {
        await window.emailjs.send('service_dhlqq6e', 'template_8ri1x28', {
          name,
          email,
          subject,
          message,
        })
        sent = true
      } catch (ejsErr) {
        console.warn('EmailJS attempt failed:', ejsErr)
      }
    }

    if (sent) {
      setStatus('success')
      setStatusMessage('Sent Successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => {
        setStatus('idle')
        setStatusMessage('Send Message')
      }, 3500)
    } else {
      // Fallback: mailto
      setStatus('fallback')
      setStatusMessage('Opening Mail...')
      window.location.href = `mailto:koushikshet2401@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`
      setTimeout(() => {
        setStatus('idle')
        setStatusMessage('Send Message')
      }, 3000)
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-ribbon">
          <span className="section-tag">06 // CONTACT</span>
          <span className="section-line"></span>
        </div>

        <div className="contact-grid">
          {/* Info column */}
          <div className="contact-info-col">
            <h2 className="contact-headline">Let&apos;s Build Something Together</h2>
            <p className="contact-sub">
              Open to backend-focused, full-stack, and AI engineering roles. Available for full-time positions and interesting consulting projects.
            </p>

            <a className="contact-link-card" href="mailto:Koushikshet2401@gmail.com">
              <span className="contact-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <div className="contact-link-info">
                <h4>Email</h4>
                <p>Koushikshet2401@gmail.com</p>
              </div>
            </a>

            <a
              className="contact-link-card"
              href="https://github.com/koushikshet2401"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">
                <i className="fab fa-github"></i>
              </span>
              <div className="contact-link-info">
                <h4>GitHub</h4>
                <p>github.com/koushikshet2401</p>
              </div>
            </a>

            <a
              className="contact-link-card"
              href="https://www.linkedin.com/in/koushik-shet-7b228a353"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">
                <i className="fab fa-linkedin-in"></i>
              </span>
              <div className="contact-link-info">
                <h4>LinkedIn</h4>
                <p>linkedin.com/in/koushik-shet-7b228a353</p>
              </div>
            </a>

            <div className="contact-link-card">
              <span className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <div className="contact-link-info">
                <h4>Location</h4>
                <p>Karnataka, India &nbsp;·&nbsp; Open to Remote</p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div>
                <label className="form-label" htmlFor="contact-name">
                  Name
                </label>
                <input
                  className="form-input"
                  type="text"
                  id="contact-name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="form-label" htmlFor="contact-email">
                  Email
                </label>
                <input
                  className="form-input"
                  type="email"
                  id="contact-email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">
                Subject
              </label>
              <input
                className="form-input"
                type="text"
                id="contact-subject"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">
                Message
              </label>
              <textarea
                className="form-textarea"
                id="contact-message"
                name="message"
                placeholder="Your message…"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              className="form-submit"
              id="contactSubmit"
              type="submit"
              disabled={status === 'sending'}
              style={{
                background: status === 'success' ? '#10b981' : undefined,
              }}
            >
              <span id="submitLabel">{statusMessage}</span>
              {status === 'sending' ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : status === 'success' ? (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  check_circle
                </span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  send
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
