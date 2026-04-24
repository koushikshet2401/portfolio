'use client'

import { useState, useEffect } from 'react'
import { fetchStats } from '@/lib/api'
import StatsCard from '@/components/admin/StatsCard'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMessages: 0,
    unreadMessages: 0,
    totalVisitors: 0,
    todayVisitors: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await fetchStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your portfolio.</p>
      </div>
      
      <div className="stats-grid">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="fas fa-folder"
          color="blue"
        />
        <StatsCard
          title="Total Messages"
          value={stats.totalMessages}
          icon="fas fa-envelope"
          color="green"
        />
        <StatsCard
          title="Unread Messages"
          value={stats.unreadMessages}
          icon="fas fa-envelope-open"
          color="yellow"
        />
        <StatsCard
          title="Total Visitors"
          value={stats.totalVisitors}
          icon="fas fa-users"
          color="purple"
        />
        <StatsCard
          title="Today's Visitors"
          value={stats.todayVisitors}
          icon="fas fa-user-check"
          color="orange"
        />
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <a href="/admin/projects" className="action-card">
            <i className="fas fa-plus-circle"></i>
            <h3>Add New Project</h3>
            <p>Create a new project showcase</p>
          </a>
          <a href="/admin/messages" className="action-card">
            <i className="fas fa-inbox"></i>
            <h3>View Messages</h3>
            <p>Check your contact messages</p>
          </a>
          <a href="/admin/profile" className="action-card">
            <i className="fas fa-user-edit"></i>
            <h3>Update Profile</h3>
            <p>Edit your profile information</p>
          </a>
        </div>
      </div>
    </div>
  )
}
