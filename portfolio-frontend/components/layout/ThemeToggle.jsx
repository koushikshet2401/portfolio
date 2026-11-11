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
      <div className="theme-toggle-track">
        <span className="material-symbols-outlined theme-icon moon-track-icon">dark_mode</span>
        <span className="material-symbols-outlined theme-icon sun-track-icon">light_mode</span>
        <div className="theme-toggle-thumb">
          <span className="material-symbols-outlined thumb-icon thumb-moon">dark_mode</span>
          <span className="material-symbols-outlined thumb-icon thumb-sun">light_mode</span>
        </div>
      </div>
    </button>
  )
}
