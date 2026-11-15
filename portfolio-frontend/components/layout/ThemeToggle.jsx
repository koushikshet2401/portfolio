'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle({ id = 'themeToggle', className = '' }) {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme') || localStorage.getItem('theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)

    const handleThemeChange = (e) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme)
      }
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => window.removeEventListener('themechange', handleThemeChange)
  }, [])

  const toggleTheme = (e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation()
    }
    const currentTheme = document.documentElement.getAttribute('data-theme') || theme || 'dark'
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    try {
      localStorage.setItem('portfolio-theme', newTheme)
      localStorage.setItem('theme', newTheme)
    } catch (err) {}

    // Dispatch global themechange event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }))

    if (typeof window.updateThreeColors === 'function') {
      try {
        window.updateThreeColors(newTheme)
      } catch (err) {
        console.warn('Three.js color update warning:', err)
      }
    }
  }

  const isLight = theme === 'light'
  const label = isLight ? 'Switch to dark theme' : 'Switch to light theme'
  const title = isLight
    ? 'Current: Sage Serenity Light (Click for Dark Theme)'
    : 'Current: Dark Theme (Click for Sage Serenity Light)'

  return (
    <button
      className={`theme-toggle-btn ${className}`}
      id={id}
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={title}
    >
      {/* Background track icons */}
      <div className="track-icon track-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>
      <div className="track-icon track-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </div>

      {/* Moving circular thumb */}
      <div className="theme-toggle-thumb" aria-hidden="true">
        {isLight ? (
          <svg className="thumb-svg thumb-sun-svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg className="thumb-svg thumb-moon-svg" viewBox="0 0 24 24">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </div>
    </button>
  )
}
