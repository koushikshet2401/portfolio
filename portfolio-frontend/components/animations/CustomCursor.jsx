'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Skip on touch-only / coarse-pointer devices (mobile, tablet) — no RAF loop wasted
    if (!window.matchMedia('(pointer: fine)').matches) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let cursorX = mouseX
    let cursorY = mouseY
    let animationFrameId

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.12
      cursorY += (mouseY - cursorY) * 0.12
      cursor.style.left = `${cursorX}px`
      cursor.style.top = `${cursorY}px`
      animationFrameId = requestAnimationFrame(animateCursor)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animationFrameId = requestAnimationFrame(animateCursor)

    const handleHoverStart = (e) => {
      const target = e.target.closest('a, button, .btn-crimson, .btn-outline, .project-card, .cert-card, .principle-card, .theme-toggle-btn')
      if (target) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.8)'
      }
    }

    const handleHoverEnd = (e) => {
      const target = e.target.closest('a, button, .btn-crimson, .btn-outline, .project-card, .cert-card, .principle-card, .theme-toggle-btn')
      if (target) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)'
      }
    }

    document.addEventListener('mouseover', handleHoverStart, { passive: true })
    document.addEventListener('mouseout', handleHoverEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleHoverStart)
      document.removeEventListener('mouseout', handleHoverEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <div className="custom-cursor" id="customCursor" ref={cursorRef} />
}
