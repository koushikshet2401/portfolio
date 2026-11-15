'use client'

import React, { useEffect, useRef, useState } from 'react'

function getFlowTargetElement(el) {
  if (!el) return null
  return el.parentElement?.classList?.contains('pin-spacer') ? el.parentElement : el
}

export default function PinnedScrollDeck({ sections = [] }) {
  const [activeSectionId, setActiveSectionId] = useState('home')
  const wrapperRef = useRef(null)
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
    let activeScrollTrigger = null
    let resizeObserver = null
    let revealObserver = null
    let refreshTimer = null
    const triggers = []

    Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ]).then(([{ default: gsap }, { ScrollTrigger }, { default: Lenis }]) => {
      if (cancelled) return
      activeGsap = gsap
      activeScrollTrigger = ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      const isMobile = window.innerWidth < 768

      // Initialize smooth Lenis
      const lenis = new Lenis({
        duration: isMobile ? 0.9 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: !isMobile,
        smoothTouch: false, // Preserves native touch momentum on mobile
        touchMultiplier: 2.2,
      })
      lenisRef.current = lenis
      activeLenis = lenis
      window.__lenis = lenis

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

        // Pin every section except the final one FIRST so .pin-spacer wraps sectionEl
        if (idx < sections.length - 1) {
          const nextEl = sectionRefs.current[idx + 1]

          const pinTrigger = ScrollTrigger.create({
            trigger: sectionEl,
            start: () => {
              const h = sectionEl.offsetHeight || window.innerHeight
              return h > window.innerHeight ? 'bottom bottom' : 'top top+=64'
            },
            end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 0.9 : 1.05)}`,
            pin: true,
            pinSpacing: false, // Next section scrolls UP and overlays this pinned section
            anticipatePin: 1,
          })
          triggers.push(pinTrigger)

          // Depth animation: pin scales down slightly & dims as next section covers it
          if (innerEl && nextEl) {
            const nextFlow = getFlowTargetElement(nextEl)
            const depthTween = gsap.to(innerEl, {
              scale: 0.95,
              opacity: 0.55,
              ease: 'none',
              scrollTrigger: {
                trigger: nextFlow,
                start: 'top bottom',
                end: 'top top+=64',
                scrub: true,
              },
            })
            if (depthTween.scrollTrigger) triggers.push(depthTween.scrollTrigger)
          }
        }

        // Attach active watcher to the unpinned flow container (.pin-spacer or element)
        // so pinned position:fixed never distorts active bounds
        const flowEl = getFlowTargetElement(sectionEl)
        const activeTrigger = ScrollTrigger.create({
          trigger: flowEl,
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
      })

      ScrollTrigger.refresh()

      // Re-sync triggers cleanly if fonts or dynamic API sections alter section height
      const scheduleRefresh = () => {
        clearTimeout(refreshTimer)
        refreshTimer = setTimeout(() => {
          if (!cancelled) ScrollTrigger.refresh()
        }, 120)
      }

      if (document.fonts?.ready) {
        document.fonts.ready.then(scheduleRefresh).catch(() => {})
      }

      if (typeof ResizeObserver !== 'undefined') {
        const lastHeights = new Map()
        resizeObserver = new ResizeObserver((entries) => {
          let changed = false
          for (const entry of entries) {
            const prev = lastHeights.get(entry.target) || 0
            const nextH = Math.round(entry.contentRect.height)
            if (Math.abs(nextH - prev) >= 4) {
              lastHeights.set(entry.target, nextH)
              changed = true
            }
          }
          if (changed) scheduleRefresh()
        })
        sectionRefs.current.forEach((el) => {
          if (el) resizeObserver.observe(el)
        })
      }

      // Reveal animation observer
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              revealObserver.unobserve(entry.target)
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
          if (window.__goToPortfolioSection) {
            window.__goToPortfolioSection(targetHash)
          }
        }, 250)
      }
    }).catch(() => {})

    return () => {
      cancelled = true
      clearTimeout(refreshTimer)
      if (resizeObserver) resizeObserver.disconnect()
      if (revealObserver) revealObserver.disconnect()
      triggers.forEach((t) => t.kill && t.kill())
      if (activeScrollTrigger) activeScrollTrigger.getAll?.()
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

  // Expose accurate scrollTo helper using unpinned .pin-spacer flow coordinates
  useEffect(() => {
    const scrollToSection = (id) => {
      const target = document.getElementById(id)
      if (!target) return

      const flowEl = getFlowTargetElement(target)
      const targetTop = Math.max(0, Math.round(flowEl.getBoundingClientRect().top + window.scrollY - 64))

      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetTop, {
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
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
    <div ref={wrapperRef} className="pinned-deck-wrapper" style={{ width: '100%', position: 'relative' }}>
      {/* Sections List */}
      {sections.map((section, idx) => (
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
              willChange: 'transform, opacity',
            }}
          >
            {section.component}
          </div>
        </div>
      ))}

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
              type="button"
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
