'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if API fails
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
    }
  }

  const navItems = [
    { href: '/admin', icon: 'fas fa-home', label: 'Dashboard' },
    { href: '/admin/projects', icon: 'fas fa-folder', label: 'Projects' },
    { href: '/admin/messages', icon: 'fas fa-envelope', label: 'Messages' },
    { href: '/admin/profile', icon: 'fas fa-user', label: 'Profile' },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Portfolio Admin</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="/" className="nav-item" target="_blank">
          <i className="fas fa-external-link-alt"></i>
          <span>View Portfolio</span>
        </a>
        
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
