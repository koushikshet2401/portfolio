import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'
import { visitorsAPI } from './api'

export class VisitorTracker {
  constructor() {
    if (typeof window !== 'undefined') {
      this.visitorId = this.getOrCreateVisitorId()
    }
  }

  getOrCreateVisitorId() {
    // Check localStorage first
    let visitorId = localStorage.getItem('visitorId')
    
    if (!visitorId) {
      // Check cookie
      visitorId = Cookies.get('visitorId')
      
      if (!visitorId) {
        // Generate new ID
        visitorId = uuidv4()
      }
      
      // Store in both
      localStorage.setItem('visitorId', visitorId)
      Cookies.set('visitorId', visitorId, { expires: 365 }) // 1 year
    }
    
    return visitorId
  }

  async trackVisit(page = '/') {
    if (typeof window === 'undefined') return

    try {
      await visitorsAPI.track({
        visitorId: this.visitorId,
        page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    } catch (error) {
      console.error('Failed to track visit:', error)
    }
  }

  async trackEvent(eventName, eventData = {}) {
    if (typeof window === 'undefined') return

    try {
      await visitorsAPI.track({
        visitorId: this.visitorId,
        event: eventName,
        data: eventData,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }
}

// Create singleton instance
export const tracker = typeof window !== 'undefined' ? new VisitorTracker() : null
