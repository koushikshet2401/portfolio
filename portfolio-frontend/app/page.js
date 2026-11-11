'use client'

import { useEffect, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/animations/CustomCursor'
import Hero from '@/components/sections/Hero'
import Activity from '@/components/sections/Activity'
import About from '@/components/sections/About'
import Experience from '@/components/sections/Experience'
import Projects from '@/components/sections/Projects'
import Skills from '@/components/sections/Skills'
import Certificates from '@/components/sections/Certificates'
import Contact from '@/components/sections/Contact'
import PinnedScrollDeck from '@/components/animations/PinnedScrollDeck'
import ScrollNavigation from '@/components/layout/ScrollNavigation'
import { tracker } from '@/lib/tracking'

export default function Home() {
  useEffect(() => {
    // Track visit if tracker is available
    if (tracker) {
      try {
        tracker.trackVisit('/')
      } catch (err) {
        // Silent tracking fallback
      }
    }

    // Clean console and display professional branding
    if (typeof console !== 'undefined') {
      try {
        console.clear()
        console.log(
          '%c 🚀 Built by Koushik Shet %c Backend & Full-Stack Engineer %c',
          'background: #CC001E; color: #FFFFFF; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px; font-size: 13px;',
          'background: #1c1b1b; color: #F0F4F5; padding: 4px 8px; border-radius: 0 4px 4px 0; font-size: 13px;',
          'background: transparent;'
        )
        console.log(
          '%c⚡ Production systems, RAG pipelines, and distributed architecture.',
          'color: #c0c8cb; font-size: 12px; margin-top: 4px;'
        )
        console.log(
          '%c📫 Contact: Koushikshet2401@gmail.com',
          'color: #CC001E; font-size: 12px;'
        )
      } catch (e) {}
    }
  }, [])

  const sections = useMemo(
    () => [
      { id: 'home', title: 'Home', component: <Hero /> },
      { id: 'activity', title: 'Telemetry', component: <Activity /> },
      { id: 'about', title: 'About', component: <About /> },
      { id: 'experience', title: 'Experience', component: <Experience /> },
      { id: 'projects', title: 'Projects', component: <Projects /> },
      { id: 'stack', title: 'Stack', component: <Skills /> },
      { id: 'certificates', title: 'Certificates', component: <Certificates /> },
      {
        id: 'contact',
        title: 'Contact',
        component: (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <div style={{ flex: 1 }}>
              <Contact />
            </div>
            <Footer />
          </div>
        ),
      },
    ],
    []
  )

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main style={{ paddingTop: '64px' }}>
        <PinnedScrollDeck sections={sections} />
      </main>

      <ScrollNavigation />
    </>
  )
}
