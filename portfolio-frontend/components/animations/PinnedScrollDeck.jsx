'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function PinnedScrollDeck({ sections = [] }) {
  const [activeSectionId, setActiveSectionId] = useState('home')
  const sectionRefs = useRef([])
  const innerRefs = useRef([])
  const lenisRef = useRef(null)

  // Initialize Lenis + GSAP ScrollTrigger dynamically in browser (zero SSR issues)
  useEffect(() => {
    if (typeof window === 'undefined') return

    let cancelled = false
    let updateTicker = null
    let activeLenis = null
    let activeGsap = null
    const triggers = []

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]).then(([{ default: gsap }, { ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return
      activeGsap = gsap

      gsap.registerPlugin(ScrollTrigger)

      // Initialize butter-smooth Lenis
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        smoothTouch: false, // Preserves native 120fps touch momentum on mobile: never blocks!
        touchMultiplier: 1.8,
      })
      lenisRef.current = lenis
      activeLenis = lenis
      window.__lenis = lenis

      // Sync Lenis scroll with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      updateTicker = (time) => {
        lenis.raf(time * 1000)
      }
      gsap.ticker.add(updateTicker)
      gsap.ticker.lagSmoothing(0)

      // Ignore minor mobile address-bar resize jitters
      ScrollTrigger.config({ ignoreMobileResize: true })

      // GSAP ScrollTrigger Stacking Cards / Pinned & Overlay (Mobile + Desktop)
      sections.forEach((sec, idx) => {
        const sectionEl = sectionRefs.current[idx]
        const innerEl = innerRefs.current[idx]
        if (!sectionEl) return

        // Active section watcher for Navbar & tracking
        const activeTrigger = ScrollTrigger.create({
          trigger: sectionEl,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (self.isActive) {
              setActiveSectionId(sec.id)
              window.dispatchEvent(
                new CustomEvent('portf:sectionChange', { detail: sec.id })
              )
            }
          },
        })
        triggers.push(activeTrigger)

        // Pin every section except the final one (Both Desktop & Mobile)
        if (idx < sections.length - 1) {
          const nextEl = sectionRefs.current[idx + 1]

          const pinTrigger = ScrollTrigger.create({
            trigger: sectionEl,
            start: () => {
              const h = sectionEl.offsetHeight || window.innerHeight
              return h > window.innerHeight ? 'bottom bottom' : 'top top+=64'
            },
            end: () => `+=${window.innerHeight * 1.05}`,
            pin: true,
            pinSpacing: false, // The next section scrolls UP and overlays this pinned section
            anticipatePin: 1,
          })
          triggers.push(pinTrigger)

          // Depth animation: pin scales down slightly & dims as next section covers it
          if (innerEl && nextEl) {
            const depthTween = gsap.to(innerEl, {
              scale: 0.95,
              opacity: 0.55,
              ease: 'none',
              scrollTrigger: {
                trigger: nextEl,
                start: 'top bottom',
                end: 'top top+=64',
                scrub: true,
              },
            })
            if (depthTween.scrollTrigger) triggers.push(depthTween.scrollTrigger)
          }
        }
      })

      // Refresh ScrollTrigger to ensure accurate layout calculation
      ScrollTrigger.refresh()

      // Reveal animation observer
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
            }
          })
        },
        { threshold: 0.15 }
      )
      document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el))

      // Handle initial hash navigation if URL has #hash
      if (window.location.hash) {
        const targetHash = window.location.hash.replace('#', '')
        setTimeout(() => {
          const targetEl = document.getElementById(targetHash)
          if (targetEl && lenis) {
            lenis.scrollTo(targetEl, { offset: -64, duration: 1.2 })
          }
        }, 300)
      }
    }).catch(() => {})

    return () => {
      cancelled = true
      triggers.forEach((t) => t.kill && t.kill())
      if (activeGsap && updateTicker) {
        activeGsap.ticker.remove(updateTicker)
      }
      if (activeLenis) {
        activeLenis.destroy()
        lenisRef.current = null
        delete window.__lenis
      }
    }
  }, [sections])

  // Expose smooth scrollTo helper for Navbar, buttons, and hash links
  useEffect(() => {
    const scrollToSection = (id) => {
      const target = document.getElementById(id)
      if (lenisRef.current && target) {
        lenisRef.current.scrollTo(target, {
          offset: -64,
          duration: 1.3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    window.__goToPortfolioSection = (id) => scrollToSection(id)

    const handleCustomNav = (e) => {
      if (e.detail) scrollToSection(e.detail)
    }

    window.addEventListener('portf:goto', handleCustomNav)

    return () => {
      delete window.__goToPortfolioSection
      window.removeEventListener('portf:goto', handleCustomNav)
    }
  }, [])

  return (
    <div className="pinned-deck-wrapper" style={{ width: '100%', position: 'relative' }}>
      {/* Sections List */}
      {sections.map((section, idx) => {
        const isHome = section.id === 'home'
        return (
          <div
            key={section.id}
            ref={(el) => (sectionRefs.current[idx] = el)}
            id={section.id}
            className="pinned-deck-section"
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'calc(100vh - 64px)',
              zIndex: 10 + idx,
              background: 'var(--surface-container-lowest)',
              boxShadow:
                idx > 0
                  ? '0 -24px 50px rgba(0, 0, 0, 0.5), 0 -2px 10px rgba(0, 0, 0, 0.25)'
                  : 'none',
              borderTop:
                idx > 0 ? '1px solid var(--surface-container-high)' : 'none',
              boxSizing: 'border-box',
            }}
          >
            {/* Inner Content Container for smooth depth scaling */}
            <div
              ref={(el) => (innerRefs.current[idx] = el)}
              className="pinned-deck-inner"
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                transformOrigin: 'top center',
              }}
            >
              {section.component}
            </div>
          </div>
        )
      })}

      {/* Floating Side Dot Navigation (Desktop) */}
      <nav
        aria-label="Section navigation"
        className="pinned-deck-dots"
        style={{
          position: 'fixed',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          padding: '0.75rem 0.5rem',
          background: 'rgba(14, 14, 14, 0.55)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '9999px',
          border: '1px solid var(--surface-container-high)',
        }}
      >
        {sections.map((sec) => {
          const isActive = sec.id === activeSectionId
          return (
            <button
              key={sec.id}
              onClick={() => {
                if (window.__goToPortfolioSection) {
                  window.__goToPortfolioSection(sec.id)
                }
              }}
              aria-label={`Jump to ${sec.title}`}
              title={sec.title}
              style={{
                position: 'relative',
                width: '10px',
                height: isActive ? '24px' : '10px',
                borderRadius: '9999px',
                background: isActive ? 'var(--crimson)' : 'var(--outline-variant)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isActive ? '0 0 12px var(--crimson)' : 'none',
                padding: 0,
              }}
            />
          )
        })}
      </nav>
    </div>
  )
}
