'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchStats, messagesAPI } from '@/lib/api'
import StatsCard from '@/components/admin/StatsCard'

// Helper to format seconds into readable dwell time string
function formatDwellTime(seconds = 0) {
  if (!seconds || seconds <= 0) return '0s'
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const remSecs = seconds % 60
  return remSecs > 0 ? `${mins}m ${remSecs}s` : `${mins}m`
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    summary: { rangeUnique: 0, rangeSessions: 0, rangePageViews: 0, avgPagesPerSession: '1.0' },
    visitors: {
      totalUnique: 0,
      todayUnique: 0,
      todayNew: 0,
      todayReturning: 0,
      totalViews: 0,
      totalSessions: 0,
      dailyTraffic: [],
      deviceBreakdown: [],
      browserBreakdown: [],
      topPages: [],
      recentVisitors: []
    },
    projectAnalytics: [],
    projects: { total: 0, featured: 0 },
    internships: { total: 0 },
    certificates: { total: 0 },
    feedback: { total: 0, unread: 0, recent: [] }
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('14d') // 'today', '7d', '14d', '30d', 'all'
  const [chartMetric, setChartMetric] = useState('unique') // 'unique', 'sessions', 'views'
  const [hoveredDay, setHoveredDay] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    loadStats(false, dateRange)
  }, [dateRange])

  const loadStats = async (isManual = false, range = dateRange) => {
    if (isManual) setRefreshing(true)
    try {
      const data = await fetchStats(range)
      if (data) {
        setStats(data)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setLoading(false)
      if (isManual) setRefreshing(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await messagesAPI.markAsRead(id)
      setStats((prev) => ({
        ...prev,
        feedback: {
          ...prev.feedback,
          unread: Math.max(0, (prev.feedback?.unread || 1) - 1),
          recent: (prev.feedback?.recent || []).map((m) =>
            m._id === id ? { ...m, read: true } : m
          )
        }
      }))
    } catch (err) {
      console.error('Failed to mark message as read:', err)
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner"></div>
        <p>Connecting to MongoDB & loading real-time analytics...</p>
      </div>
    )
  }

  const trafficData = stats.visitors?.dailyTraffic || []
  const maxTrafficVal = Math.max(
    ...trafficData.map((d) => {
      if (chartMetric === 'unique') return d.uniqueVisitors || 0
      if (chartMetric === 'sessions') return d.sessions || 0
      return d.pageViews || 0
    }),
    5
  )

  const rangeUniqueTotal = stats.summary?.rangeUnique ?? trafficData.reduce((acc, curr) => acc + (curr.uniqueVisitors || 0), 0)
  const rangeSessionsTotal = stats.summary?.rangeSessions ?? trafficData.reduce((acc, curr) => acc + (curr.sessions || 0), 0)
  const rangeViewsTotal = stats.summary?.rangePageViews ?? trafficData.reduce((acc, curr) => acc + (curr.pageViews || 0), 0)

  // Max engagement calculation for progress bars
  const maxEngagementScore = Math.max(
    ...(stats.projectAnalytics || []).map((p) => p.totalClicks * 10 + p.totalDwellSeconds),
    1
  )

  // Device total
  const deviceTotal = (stats.visitors?.deviceBreakdown || []).reduce((acc, d) => acc + d.count, 0) || 1

  return (
    <div className="admin-dashboard">
      {/* Top Header Bar */}
      <div className="dashboard-header-container">
        <div className="dashboard-title-area">
          <div className="dashboard-status-tag">
            <span className="live-dot"></span>
            <span>MongoDB Connected · Real-Time Data</span>
          </div>
          <h1>Admin Overview &amp; Analytics</h1>
          <p>
            Monitor real unique visitors, sessions, project engagement, and audience demographics.
          </p>
        </div>

        <div className="dashboard-actions-area">
          {lastUpdated && (
            <span className="last-sync-text">
              <i className="fas fa-clock"></i> Synced: {lastUpdated}
            </span>
          )}
          <button
            className={`btn-sync ${refreshing ? 'spinning' : ''}`}
            onClick={() => loadStats(true, dateRange)}
            disabled={refreshing}
            title="Refresh database metrics"
          >
            <i className="fas fa-sync-alt"></i>
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 Cards Covering All Required Counts) */}
      <div className="stats-grid">
        {/* 1. Website Visitors - All-time Unique */}
        <StatsCard
          title="Overall Unique Visitors"
          value={stats.visitors?.totalUnique ?? 0}
          subtitle={`${stats.visitors?.totalViews ?? 0} total page hits`}
          icon="fas fa-users"
          color="blue"
          href="#traffic-analytics"
        />

        {/* 2. Today's Unique Visitors */}
        <StatsCard
          title="Today's Unique Visitors"
          value={stats.visitors?.todayUnique ?? 0}
          badge={`${stats.visitors?.todayNew ?? 0} new`}
          subtitle={`${stats.visitors?.todayReturning ?? 0} returning visitors`}
          icon="fas fa-user-check"
          color="teal"
          href="#traffic-analytics"
        />

        {/* 3. Projects Count */}
        <StatsCard
          title="Projects in Portfolio"
          value={stats.projects?.total ?? 0}
          badge={stats.projects?.featured ? `${stats.projects.featured} featured` : null}
          subtitle="Click to manage projects →"
          icon="fas fa-folder"
          color="indigo"
          href="/admin/projects"
        />

        {/* 4. Internships/Experience Count */}
        <StatsCard
          title="Work & Internships"
          value={stats.internships?.total ?? 0}
          subtitle="Click to manage experience →"
          icon="fas fa-briefcase"
          color="purple"
          href="/admin/internships"
        />

        {/* 5. Certifications Count */}
        <StatsCard
          title="Verified Certifications"
          value={stats.certificates?.total ?? 0}
          subtitle="Click to manage certificates →"
          icon="fas fa-award"
          color="orange"
          href="/admin/certificates"
        />

        {/* 6. User Feedback Count */}
        <StatsCard
          title="User Feedback & Messages"
          value={stats.feedback?.total ?? 0}
          badge={stats.feedback?.unread > 0 ? `${stats.feedback.unread} unread` : 'All read'}
          subtitle="Click to read messages →"
          icon="fas fa-comment-dots"
          color="green"
          href="/admin/messages"
        />
      </div>

      {/* Date Range Control Bar */}
      <div className="date-range-filter-bar">
        <div className="date-filter-group">
          <span className="date-filter-label">
            <i className="fas fa-calendar-alt"></i> Date Range:
          </span>
          {[
            { id: 'today', label: 'Today' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '14d', label: 'Last 14 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: 'All Time' }
          ].map((r) => (
            <button
              key={r.id}
              className={`filter-pill ${dateRange === r.id ? 'active' : ''}`}
              onClick={() => setDateRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="sync-status-indicator">
          <i className="fas fa-cookie-bite" style={{ color: '#d97706' }}></i>
          <span>Anonymous 1-Yr Cookie ID + 30-min Session Tracking</span>
        </div>
      </div>

      {/* Analytics Dashboard Section */}
      <div id="traffic-analytics" className="analytics-section">
        <div className="analytics-main-card">
          <div className="card-top-header">
            <div>
              <h2>Website Visitors &amp; Traffic Trends</h2>
              <p className="card-sub-description">
                Persistent anonymous cookie identifiers. Refreshing does not inflate unique visitor counts.
              </p>
            </div>
            <div className="chart-toggle-group">
              <button
                className={`toggle-btn ${chartMetric === 'unique' ? 'active' : ''}`}
                onClick={() => setChartMetric('unique')}
              >
                <i className="fas fa-user"></i> Unique
              </button>
              <button
                className={`toggle-btn ${chartMetric === 'sessions' ? 'active' : ''}`}
                onClick={() => setChartMetric('sessions')}
              >
                <i className="fas fa-layer-group"></i> Sessions
              </button>
              <button
                className={`toggle-btn ${chartMetric === 'views' ? 'active' : ''}`}
                onClick={() => setChartMetric('views')}
              >
                <i className="fas fa-eye"></i> Page Hits
              </button>
            </div>
          </div>

          {/* Traffic Summary Badges for Selected Range */}
          <div className="traffic-quick-stats">
            <div className="traffic-stat-item">
              <span className="traffic-stat-label">Unique Visitors</span>
              <span className="traffic-stat-value">{rangeUniqueTotal}</span>
            </div>
            <div className="traffic-stat-item">
              <span className="traffic-stat-label">Total Sessions</span>
              <span className="traffic-stat-value">{rangeSessionsTotal}</span>
            </div>
            <div className="traffic-stat-item">
              <span className="traffic-stat-label">Total Page Hits</span>
              <span className="traffic-stat-value">{rangeViewsTotal}</span>
            </div>
            <div className="traffic-stat-item">
              <span className="traffic-stat-label">Avg Hits / Session</span>
              <span className="traffic-stat-value">{stats.summary?.avgPagesPerSession || '1.0'}</span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="chart-container">
            {trafficData.length === 0 ? (
              <div className="chart-empty-state">
                <i className="fas fa-chart-line"></i>
                <p>No traffic recorded in this date range.</p>
                <span>Visits from users on your portfolio will automatically plot here!</span>
              </div>
            ) : (
              <div className="bar-chart-wrapper">
                {trafficData.map((day, idx) => {
                  let val = day.uniqueVisitors || 0
                  if (chartMetric === 'sessions') val = day.sessions || 0
                  if (chartMetric === 'views') val = day.pageViews || 0

                  const barHeightPercent = Math.max(
                    Math.round((val / maxTrafficVal) * 100),
                    val > 0 ? 8 : 2
                  )
                  const isHovered = hoveredDay === idx

                  let gradientClass = 'unique-gradient'
                  if (chartMetric === 'sessions') gradientClass = 'sessions-gradient'
                  if (chartMetric === 'views') gradientClass = 'views-gradient'

                  return (
                    <div
                      key={day.date}
                      className="bar-col"
                      onMouseEnter={() => setHoveredDay(idx)}
                      onMouseLeave={() => setHoveredDay(null)}
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="bar-tooltip">
                          <div className="tooltip-date">{day.label}</div>
                          <div className="tooltip-row">
                            <span>Unique:</span> <strong>{day.uniqueVisitors}</strong>
                          </div>
                          <div className="tooltip-row">
                            <span>Sessions:</span> <strong>{day.sessions || day.uniqueVisitors}</strong>
                          </div>
                          <div className="tooltip-row">
                            <span>Page Hits:</span> <strong>{day.pageViews}</strong>
                          </div>
                        </div>
                      )}

                      <div className="bar-track">
                        <div
                          className={`bar-fill ${val > 0 ? 'has-val' : 'empty-val'} ${gradientClass}`}
                          style={{ height: `${barHeightPercent}%` }}
                        >
                          {val > 0 && <span className="bar-top-value">{val}</span>}
                        </div>
                      </div>
                      <span className="bar-label">{day.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Side Insights: Breakdown & Top Pages */}
        <div className="analytics-sidebar-card">
          <h3>Today's Visitor Distribution</h3>
          <p className="sidebar-sub">New vs Returning Audience</p>

          <div className="visitor-ratio-container">
            <div className="ratio-labels">
              <span>New ({stats.visitors?.todayNew ?? 0})</span>
              <span>Returning ({stats.visitors?.todayReturning ?? 0})</span>
            </div>
            <div className="ratio-bar-track">
              <div
                className="ratio-fill-new"
                style={{
                  width:
                    stats.visitors?.todayUnique > 0
                      ? `${((stats.visitors.todayNew || 0) / stats.visitors.todayUnique) * 100}%`
                      : '50%'
                }}
              ></div>
              <div
                className="ratio-fill-returning"
                style={{
                  width:
                    stats.visitors?.todayUnique > 0
                      ? `${((stats.visitors.todayReturning || 0) / stats.visitors.todayUnique) * 100}%`
                      : '50%'
                }}
              ></div>
            </div>
          </div>

          <div className="top-pages-list">
            <h4>Most Visited Routes</h4>
            {stats.visitors?.topPages && stats.visitors.topPages.length > 0 ? (
              stats.visitors.topPages.map((page, idx) => (
                <div key={idx} className="page-row">
                  <div className="page-name">
                    <i className="fas fa-link"></i>
                    <code>{page.page || '/'}</code>
                  </div>
                  <span className="page-hits">{page.count} hits</span>
                </div>
              ))
            ) : (
              <p className="no-data-note">No route hits tracked yet.</p>
            )}
          </div>

          <div className="privacy-badge-box">
            <i className="fas fa-shield-alt"></i>
            <div>
              <strong>Anonymous &amp; Cookie-Based</strong>
              <p>No logins required. Transparent 1-year UUID cookie + session storage tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Engagement Analytics Section */}
      <div className="project-engagement-card">
        <div className="card-top-header">
          <div>
            <h2>Project Engagement &amp; Attention Analytics</h2>
            <p className="card-sub-description">
              Measure user dwell time and click interactions (GitHub repositories, live demos, and card inspects) per project.
            </p>
          </div>
          <Link href="/admin/projects" className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
            <i className="fas fa-cog"></i> Manage Projects
          </Link>
        </div>

        <div className="engagement-table-wrapper">
          <table className="engagement-table">
            <thead>
              <tr>
                <th>Project Showcase</th>
                <th>Total Clicks</th>
                <th>GitHub Repo</th>
                <th>Live Demo / Card</th>
                <th>Dwell Attention</th>
                <th>Engaged Users</th>
                <th>Interest Level</th>
              </tr>
            </thead>
            <tbody>
              {stats.projectAnalytics && stats.projectAnalytics.length > 0 ? (
                stats.projectAnalytics.map((proj) => {
                  const score = proj.totalClicks * 10 + proj.totalDwellSeconds
                  const pct = Math.min(100, Math.max(10, Math.round((score / maxEngagementScore) * 100)))

                  return (
                    <tr key={proj._id}>
                      <td>
                        <div className="project-title-cell">
                          <strong>{proj.title}</strong>
                          <div className="project-badges-mini">
                            {proj.featured && <span className="badge-mini flagship">FLAGSHIP</span>}
                            {proj.badges?.slice(0, 2).map((b, bIdx) => (
                              <span key={bIdx} className="badge-mini">{b}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="click-stat-badge">
                          <i className="fas fa-mouse-pointer"></i> {proj.totalClicks} clicks
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                          <i className="fab fa-github" style={{ marginRight: '0.35rem', color: '#1e293b' }}></i>
                          {proj.githubClicks || 0}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                          <i className="fas fa-external-link-alt" style={{ marginRight: '0.35rem', color: '#2563eb' }}></i>
                          {(proj.demoClicks || 0) + (proj.cardClicks || 0)}
                        </span>
                      </td>
                      <td>
                        <span className="dwell-time-badge">
                          <i className="fas fa-stopwatch"></i> {formatDwellTime(proj.totalDwellSeconds)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: '#334155' }}>
                          <i className="fas fa-user-check" style={{ marginRight: '0.35rem', color: '#059669' }}></i>
                          {proj.uniqueVisitorsEngaged || 0}
                        </span>
                      </td>
                      <td>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                            {pct}%
                          </span>
                          <div className="engagement-bar-track">
                            <div className="engagement-bar-fill" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No project interactions recorded yet. Visitors clicking or viewing projects on your portfolio will populate here!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audience Demographics & Anonymous Visitor Activity Stream */}
      <div className="demographics-grid">
        {/* Device Breakdown */}
        <div className="demo-card">
          <h3>Device Distribution</h3>
          <p>Portfolio visitors by client form factor</p>

          {(stats.visitors?.deviceBreakdown || []).length > 0 ? (
            stats.visitors.deviceBreakdown.map((item, idx) => {
              const pct = Math.round((item.count / deviceTotal) * 100)
              let icon = 'fas fa-desktop'
              if (item.device === 'Mobile') icon = 'fas fa-mobile-alt'
              if (item.device === 'Tablet') icon = 'fas fa-tablet-alt'

              return (
                <div key={idx} className="demo-item-row">
                  <div className="demo-item-info">
                    <i className={icon} style={{ color: '#2563eb' }}></i>
                    <span>{item.device}</span>
                  </div>
                  <div className="demo-bar-container">
                    <div className="demo-bar-track">
                      <div className="demo-bar-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="demo-val">{pct}%</span>
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Awaiting visitor connections...</p>
          )}
        </div>

        {/* Browser Breakdown */}
        <div className="demo-card">
          <h3>Web Browsers</h3>
          <p>Browsers used across incoming sessions</p>

          {(stats.visitors?.browserBreakdown || []).length > 0 ? (
            stats.visitors.browserBreakdown.slice(0, 5).map((item, idx) => {
              const pct = Math.round((item.count / deviceTotal) * 100)
              let icon = 'fas fa-globe'
              if (item.browser === 'Chrome') icon = 'fab fa-chrome'
              if (item.browser === 'Firefox') icon = 'fab fa-firefox-browser'
              if (item.browser === 'Safari') icon = 'fab fa-safari'
              if (item.browser === 'Edge') icon = 'fab fa-edge'

              return (
                <div key={idx} className="demo-item-row">
                  <div className="demo-item-info">
                    <i className={icon} style={{ color: '#6366f1' }}></i>
                    <span>{item.browser}</span>
                  </div>
                  <div className="demo-bar-container">
                    <div className="demo-bar-track">
                      <div className="demo-bar-fill" style={{ width: `${pct}%`, background: '#6366f1' }}></div>
                    </div>
                    <span className="demo-val">{pct}%</span>
                  </div>
                </div>
              )
            })
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Awaiting browser connections...</p>
          )}
        </div>
      </div>

      {/* Anonymous Live Visitor Activity Log */}
      <div className="anonymous-log-card">
        <div className="card-top-header">
          <div>
            <h2>Recent Anonymous Visitor Sessions</h2>
            <p className="card-sub-description">
              Audited by persistent cookie identifier. No fake names, pure privacy-respecting telemetry.
            </p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing latest {stats.visitors?.recentVisitors?.length || 0} unique visitors
          </span>
        </div>

        <div className="engagement-table-wrapper">
          <table className="engagement-table">
            <thead>
              <tr>
                <th>Anonymous ID</th>
                <th>Device &amp; OS</th>
                <th>Browser</th>
                <th>Total Sessions</th>
                <th>Total Hits</th>
                <th>Referrer</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {stats.visitors?.recentVisitors && stats.visitors.recentVisitors.length > 0 ? (
                stats.visitors.recentVisitors.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <span className="visitor-id-tag">{v.anonymousLabel}</span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <i className={v.device === 'Mobile' ? 'fas fa-mobile-alt' : 'fas fa-desktop'} style={{ color: '#64748b' }}></i>
                        {v.device} · <span className="meta-sub-pill">{v.os}</span>
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#334155' }}>{v.browser}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#2563eb' }}>{v.totalSessions || 1}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#475569' }}>{v.totalVisits || 1} hits</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {v.referrer?.startsWith('http') ? new URL(v.referrer).hostname : (v.referrer || 'Direct')}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {v.lastVisit ? new Date(v.lastVisit).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No recent visitors recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback & Inquiries + Quick Actions Grid */}
      <div className="dashboard-bottom-grid">
        {/* Recent Feedback Submissions */}
        <div className="dashboard-card recent-feedback-card">
          <div className="card-header-flex">
            <div>
              <h2>Recent User Feedback &amp; Inquiries</h2>
              <p>Messages received from visitors via your portfolio contact form</p>
            </div>
            <Link href="/admin/messages" className="btn-link">
              View All ({stats.feedback?.total ?? 0}) <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          {stats.feedback?.recent && stats.feedback.recent.length > 0 ? (
            <div className="feedback-list">
              {stats.feedback.recent.map((msg) => (
                <div key={msg._id} className={`feedback-item ${msg.read ? 'read' : 'unread'}`}>
                  <div className="feedback-avatar">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="feedback-content">
                    <div className="feedback-header">
                      <strong>{msg.name}</strong>
                      <span className="feedback-email">{msg.email}</span>
                      {!msg.read && <span className="unread-pill">NEW</span>}
                      <span className="feedback-date">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="feedback-subject">{msg.subject}</div>
                    <p className="feedback-text">{msg.message}</p>
                  </div>
                  <div className="feedback-actions">
                    {!msg.read && (
                      <button
                        className="btn-mark-read"
                        onClick={() => handleMarkAsRead(msg._id)}
                        title="Mark as read"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}
                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="btn-reply"
                      title="Reply via Email"
                    >
                      <i className="fas fa-reply"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-feedback-state">
              <i className="fas fa-inbox"></i>
              <h4>No feedback submissions yet</h4>
              <p>Submissions made through your contact form will appear here in real time.</p>
            </div>
          )}
        </div>

        {/* Quick Actions & Navigation */}
        <div className="dashboard-card quick-actions-card">
          <h2>Manage Portfolio Data</h2>
          <p>Quick shortcuts to create and edit MongoDB entries</p>

          <div className="actions-vertical-list">
            <Link href="/admin/projects" className="action-row">
              <div className="action-icon blue">
                <i className="fas fa-folder-plus"></i>
              </div>
              <div className="action-text">
                <strong>Manage Projects ({stats.projects?.total ?? 0})</strong>
                <span>Add, update, or reorganize project showcases</span>
              </div>
              <i className="fas fa-chevron-right action-arrow"></i>
            </Link>

            <Link href="/admin/internships" className="action-row">
              <div className="action-icon purple">
                <i className="fas fa-briefcase"></i>
              </div>
              <div className="action-text">
                <strong>Manage Experience ({stats.internships?.total ?? 0})</strong>
                <span>Add company roles, dates, and achievements</span>
              </div>
              <i className="fas fa-chevron-right action-arrow"></i>
            </Link>

            <Link href="/admin/certificates" className="action-row">
              <div className="action-icon orange">
                <i className="fas fa-award"></i>
              </div>
              <div className="action-text">
                <strong>Manage Certifications ({stats.certificates?.total ?? 0})</strong>
                <span>Add certificates, links, and credential years</span>
              </div>
              <i className="fas fa-chevron-right action-arrow"></i>
            </Link>

            <Link href="/admin/messages" className="action-row">
              <div className="action-icon green">
                <i className="fas fa-envelope-open-text"></i>
              </div>
              <div className="action-text">
                <strong>User Feedback ({stats.feedback?.total ?? 0})</strong>
                <span>Read inquiries and mark responses</span>
              </div>
              <i className="fas fa-chevron-right action-arrow"></i>
            </Link>

            <Link href="/admin/profile" className="action-row">
              <div className="action-icon indigo">
                <i className="fas fa-user-edit"></i>
              </div>
              <div className="action-text">
                <strong>Edit Developer Profile</strong>
                <span>Update bio, skills, resume PDF, and contact links</span>
              </div>
              <i className="fas fa-chevron-right action-arrow"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
