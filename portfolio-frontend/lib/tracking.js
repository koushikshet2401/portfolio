import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { visitorsAPI } from './api'

export class VisitorTracker {
  constructor() {
    if (typeof window !== 'undefined') {
      this.visitorId = this.getOrCreateVisitorId()
      this.sessionId = this.getOrCreateSessionId()
      this.projectDwellTimers = new Map()
    }
  }

  // Persistent 1-year anonymous Visitor ID stored via Cookie (with localStorage fallback)
  getOrCreateVisitorId() {
    let visitorId = Cookies.get('portfolio_vid')

    if (!visitorId) {
      visitorId = localStorage.getItem('portfolio_vid')
    }

    if (!visitorId) {
      visitorId = 'vid_' + uuidv4().replace(/-/g, '').slice(0, 16)
    }

    // Persist in cookie (1 year) and localStorage
    try {
      Cookies.set('portfolio_vid', visitorId, { expires: 365, path: '/', sameSite: 'Lax' })
      localStorage.setItem('portfolio_vid', visitorId)
    } catch (e) {
      // Storage access blocked or restricted
    }

    return visitorId
  }

  // Session ID managed via sessionStorage & 30-minute inactivity cookie
  getOrCreateSessionId() {
    const SESSION_EXPIRY_MS = 30 * 60 * 1000 // 30 minutes
    const now = Date.now()

    let sessionId = null
    let lastActivity = null

    try {
      sessionId = sessionStorage.getItem('portfolio_sid') || Cookies.get('portfolio_sid')
      lastActivity = parseInt(sessionStorage.getItem('portfolio_sid_last') || '0', 10)
    } catch (e) {}

    // Check if session expired or doesn't exist
    if (!sessionId || !lastActivity || now - lastActivity > SESSION_EXPIRY_MS) {
      sessionId = 'sid_' + uuidv4().replace(/-/g, '').slice(0, 12)
    }

    // Refresh session activity timestamp
    try {
      sessionStorage.setItem('portfolio_sid', sessionId)
      sessionStorage.setItem('portfolio_sid_last', now.toString())
      const expiresDate = new Date(now + SESSION_EXPIRY_MS)
      Cookies.set('portfolio_sid', sessionId, { expires: expiresDate, path: '/', sameSite: 'Lax' })
    } catch (e) {}

    return sessionId
  }

  // Track page visit (skips admin dashboard)
  async trackVisit(page = '/') {
    if (typeof window === 'undefined') return

    const currentPath = window.location.pathname || page
    if (currentPath.startsWith('/admin')) {
      return
    }

    // Refresh active session timestamp
    this.sessionId = this.getOrCreateSessionId()

    // Debounce duplicate calls within 2.5 seconds on the same page
    const now = Date.now()
    if (this._lastTrackedPage === page && this._lastTrackedTime && now - this._lastTrackedTime < 2500) {
      return
    }
    this._lastTrackedPage = page
    this._lastTrackedTime = now

    try {
      await visitorsAPI.track({
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    } catch (error) {
      // Silent telemetry fallback
    }
  }

  // Track project interactions: clicks (card, github, live demo)
  async trackProjectClick(projectId, projectTitle, action = 'card_click', targetUrl = '') {
    if (typeof window === 'undefined' || !projectTitle) return

    this.sessionId = this.getOrCreateSessionId()

    try {
      await visitorsAPI.trackEngagement({
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        projectId: projectId || undefined,
        projectTitle,
        action,
        dwellSeconds: 0,
        metadata: {
          targetUrl,
          viewportWidth: window.innerWidth,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      // Silent telemetry fallback
    }
  }

  // Start dwell time counter for a project card
  startProjectDwell(projectId, projectTitle) {
    if (typeof window === 'undefined' || !projectTitle) return
    const key = projectId || projectTitle
    if (!this.projectDwellTimers.has(key)) {
      this.projectDwellTimers.set(key, {
        projectTitle,
        projectId,
        startTime: Date.now()
      })
    }
  }

  // End dwell time counter and report if viewed for at least 2 seconds
  async endProjectDwell(projectId, projectTitle) {
    if (typeof window === 'undefined' || !projectTitle) return
    const key = projectId || projectTitle
    const timer = this.projectDwellTimers.get(key)
    if (!timer) return

    this.projectDwellTimers.delete(key)
    const elapsedSeconds = (Date.now() - timer.startTime) / 1000

    // Only record genuine engagement of 2 seconds or more
    if (elapsedSeconds >= 2) {
      this.sessionId = this.getOrCreateSessionId()
      try {
        await visitorsAPI.trackEngagement({
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          projectId: timer.projectId || undefined,
          projectTitle: timer.projectTitle,
          action: 'dwell',
          dwellSeconds: Math.round(elapsedSeconds),
          metadata: {
            timestamp: new Date().toISOString()
          }
        })
      } catch (error) {
        // Silent telemetry fallback
      }
    }
  }
}

// Create singleton instance
export const tracker = typeof window !== 'undefined' ? new VisitorTracker() : null
