'use client'

import { useState, useRef, useEffect } from 'react'
import { messagesAPI } from '@/lib/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error' | 'fallback'
  const [statusMessage, setStatusMessage] = useState('Send Message')
  const [validationError, setValidationError] = useState('')
  const resetTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const handleChange = (e) => {
    if (validationError) setValidationError('')
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = formData.name.trim()
    const email = formData.email.trim()
    const subject = formData.subject.trim()
    const message = formData.message.trim()

    if (!name || !email || !subject || !message) {
      setValidationError('Please fill in all fields before sending.')
      return
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setValidationError('Please enter a valid email address.')
      return
    }

    setValidationError('')
    setStatus('sending')
    setStatusMessage('Sending...')

    let sent = false

    // Attempt 0: Save directly to MongoDB backend if available
    try {
      const apiRes = await messagesAPI.create({ name, email, subject, message })
      if (apiRes?.data?.success) {
        sent = true
      }
    } catch (e) {
      // Backend optional when running standalone static; continue to email relay
    }

    // Attempt 1: Direct email relay via FormSubmit
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
      if (!sent) {
        console.warn('FormSubmit relay unavailable, trying fallback:', fsErr?.message || fsErr)
      }
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
        console.warn('EmailJS attempt failed:', ejsErr?.message || ejsErr)
      }
    }

    if (sent) {
      setStatus('success')
      setStatusMessage('Sent Successfully!')
      setFormData({ name: '', email: '', subject: '', message: '' })
      resetTimerRef.current = setTimeout(() => {
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
      resetTimerRef.current = setTimeout(() => {
        setStatus('idle')
        setStatusMessage('Send Message')
      }, 3000)
    }
  }

  return (
    <section className="section">
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
              <span className="contact-icon" aria-hidden="true">
                <i className="fas fa-envelope"></i>
              </span>
              <div className="contact-link-info">
                <h3>Email</h3>
                <p>Koushikshet2401@gmail.com</p>
              </div>
            </a>

            <a
              className="contact-link-card"
              href="https://github.com/koushikshet2401"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon" aria-hidden="true">
                <i className="fab fa-github"></i>
              </span>
              <div className="contact-link-info">
                <h3>GitHub</h3>
                <p>github.com/koushikshet2401</p>
              </div>
            </a>

            <a
              className="contact-link-card"
              href="https://www.linkedin.com/in/koushik-shet-7b228a353"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon" aria-hidden="true">
                <i className="fab fa-linkedin-in"></i>
              </span>
              <div className="contact-link-info">
                <h3>LinkedIn</h3>
                <p>linkedin.com/in/koushik-shet-7b228a353</p>
              </div>
            </a>

            <div className="contact-link-card">
              <span className="contact-icon" aria-hidden="true">
                <i className="fas fa-map-marker-alt"></i>
              </span>
              <div className="contact-link-info">
                <h3>Location</h3>
                <p>Karnataka, India &nbsp;·&nbsp; Open to Remote</p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
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
            {validationError && (
              <p
                role="alert"
                style={{
                  color: 'var(--crimson-light, #ffb3ad)',
                  fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                  fontSize: '0.72rem',
                  marginBottom: '0.75rem',
                }}
              >
                {validationError}
              </p>
            )}
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
                <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
              ) : status === 'success' ? (
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
                  check_circle
                </span>
              ) : (
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontSize: '18px' }}>
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
