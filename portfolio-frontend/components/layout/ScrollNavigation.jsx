'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'

export default function ScrollNavigation() {
  const [atTop, setAtTop] = useState(true)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      )

      setAtTop(scrollY < 120)
      setAtBottom(scrollY >= maxScroll - 120)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.15 })
    } else if (typeof window !== 'undefined' && window.__goToPortfolioSection) {
      window.__goToPortfolioSection('home')
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToBottom = () => {
    if (typeof window === 'undefined') return
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    if (window.__lenis) {
      window.__lenis.scrollTo(maxY, { duration: 1.15 })
    } else {
      window.scrollTo({
        top: maxY,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div
      className="scroll-navigation-pill"
      role="region"
      aria-label="Scroll navigation controls"
      style={{
        position: 'fixed',
        right: '1.5rem',
        bottom: '1.5rem',
        zIndex: 95,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'var(--navbar-bg, rgba(14, 14, 14, 0.75))',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--surface-container-high, rgba(255, 255, 255, 0.12))',
        borderRadius: '9999px',
        padding: '0.25rem',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Scroll to Top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
        className="scroll-nav-btn"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: atTop ? 'var(--outline, #71717a)' : 'var(--on-surface, #F0F4F5)',
          opacity: atTop ? 0.45 : 1,
          transition: 'all 0.2s ease',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF'
          e.currentTarget.style.background = 'var(--crimson, #CC001E)'
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = atTop
            ? 'var(--outline, #71717a)'
            : 'var(--on-surface, #F0F4F5)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.opacity = atTop ? '0.45' : '1'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <ArrowUp size={18} strokeWidth={2.4} />
      </button>

      {/* Divider */}
      <span
        style={{
          width: '20px',
          height: '1px',
          background: 'var(--surface-container-high, rgba(255, 255, 255, 0.12))',
          margin: '2px 0',
        }}
      />

      {/* Scroll to Bottom */}
      <button
        type="button"
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
        title="Scroll to bottom"
        className="scroll-nav-btn"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: atBottom ? 'var(--outline, #71717a)' : 'var(--on-surface, #F0F4F5)',
          opacity: atBottom ? 0.45 : 1,
          transition: 'all 0.2s ease',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF'
          e.currentTarget.style.background = 'var(--crimson, #CC001E)'
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'translateY(2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = atBottom
            ? 'var(--outline, #71717a)'
            : 'var(--on-surface, #F0F4F5)'
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.opacity = atBottom ? '0.45' : '1'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        <ArrowDown size={18} strokeWidth={2.4} />
      </button>
    </div>
  )
}
