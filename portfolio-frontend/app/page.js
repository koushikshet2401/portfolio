'use client'

import { useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import ThemeToggle from '@/components/layout/ThemeToggle'
import ThreeBackground from '@/components/animations/ThreeBackground'
import SmoothScroll from '@/components/animations/SmoothScroll'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Certificates from '@/components/sections/Certificates'
import Contact from '@/components/sections/Contact'
import { tracker } from '@/lib/tracking'

export default function Home() {
  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Track visit
    if (tracker) {
      tracker.trackVisit('/')
    }
  }, [])

  return (
    <>
      <ThreeBackground />
      <SmoothScroll />
      <ThemeToggle />
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Koushik Shet. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
