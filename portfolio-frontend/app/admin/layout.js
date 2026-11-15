'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { authAPI } from '@/lib/api'
import '../../styles/admin.css'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const verifiedTokenRef = useRef(null)

  // If we are on the login page, skip the auth wrapper entirely — just render children
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    let active = true

    if (isLoginPage) {
      setIsLoading(false)
      return
    }

    const token = localStorage.getItem('adminToken')
    if (!token) {
      verifiedTokenRef.current = null
      setIsAuthenticated(false)
      setIsLoading(false)
      router.replace('/admin/login')
      return
    }

    // Reuse verified session across client-side admin route transitions
    if (verifiedTokenRef.current === token) {
      setIsAuthenticated(true)
      setIsLoading(false)
      return
    }

    authAPI
      .verifyToken()
      .then(() => {
        if (!active) return
        verifiedTokenRef.current = token
        setIsAuthenticated(true)
        setIsLoading(false)
      })
      .catch((err) => {
        if (!active) return
        const status = err?.response?.status
        if (status === 401 || status === 403) {
          localStorage.removeItem('adminToken')
          verifiedTokenRef.current = null
          setIsAuthenticated(false)
          setIsLoading(false)
          router.replace('/admin/login')
        } else {
          // Backend temporarily unreachable — let individual page handle network state cleanly
          setIsAuthenticated(true)
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [router, isLoginPage, pathname])

  // Login page: render with NO admin chrome
  if (isLoginPage) {
    return <>{children}</>
  }

  // Protected admin pages: require verified auth
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.1rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#667eea',
        }}
      >
        Verifying session...
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  )
}
