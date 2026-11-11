const Visitor = require('../models/Visitor')
const ProjectEngagement = require('../models/ProjectEngagement')

// Helper to parse UserAgent cleanly into device, browser, and OS
function parseUserAgent(ua = '') {
  const agent = ua.toLowerCase()
  let device = 'Desktop'
  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(agent)) {
    device = 'Mobile'
  } else if (/ipad|tablet|playbook|silk/i.test(agent)) {
    device = 'Tablet'
  }

  let browser = 'Other'
  if (agent.includes('edg/')) {
    browser = 'Edge'
  } else if (agent.includes('chrome') && !agent.includes('chromium')) {
    browser = 'Chrome'
  } else if (agent.includes('safari') && !agent.includes('chrome')) {
    browser = 'Safari'
  } else if (agent.includes('firefox')) {
    browser = 'Firefox'
  } else if (agent.includes('opera') || agent.includes('opr/')) {
    browser = 'Opera'
  }

  let os = 'Other'
  if (agent.includes('win')) os = 'Windows'
  else if (agent.includes('mac') && !agent.includes('iphone') && !agent.includes('ipad')) os = 'macOS'
  else if (agent.includes('android')) os = 'Android'
  else if (agent.includes('iphone') || agent.includes('ipad')) os = 'iOS'
  else if (agent.includes('linux')) os = 'Linux'

  return { device, browser, os }
}

// Track visitor with cookie ID and session management
exports.trackVisit = async (req, res) => {
  try {
    const { visitorId, sessionId, page, timestamp, userAgent, referrer, event, data } = req.body
    
    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID is required'
      })
    }

    const clientUA = userAgent || req.headers['user-agent'] || ''
    const { device, browser, os } = parseUserAgent(clientUA)
    const now = timestamp ? new Date(timestamp) : new Date()
    const activeSessionId = sessionId || `sid_${Date.now()}`
    
    let visitor = await Visitor.findOne({ visitorId })
    
    if (visitor) {
      // Manage session: check if this sessionId already exists
      const existingSession = visitor.sessions.find(s => s.sessionId === activeSessionId)
      if (existingSession) {
        existingSession.lastActivity = now
        existingSession.pageViews = (existingSession.pageViews || 1) + 1
      } else {
        visitor.sessions.push({
          sessionId: activeSessionId,
          startedAt: now,
          lastActivity: now,
          pageViews: 1
        })
        visitor.totalSessions = visitor.sessions.length
      }

      // Add visit record (cap stored visits array to 100 to keep documents lean)
      if (visitor.visits.length >= 100) {
        visitor.visits.shift()
      }
      visitor.visits.push({ 
        page: page || '/', 
        timestamp: now,
        sessionId: activeSessionId,
        event,
        data
      })

      visitor.lastVisit = now
      visitor.totalVisits += 1
      visitor.device = device
      visitor.browser = browser
      visitor.os = os
      if (referrer && !visitor.referrer) visitor.referrer = referrer
      if (clientUA && !visitor.userAgent) visitor.userAgent = clientUA

      await visitor.save()
    } else {
      // Create new visitor
      visitor = await Visitor.create({
        visitorId,
        sessions: [{
          sessionId: activeSessionId,
          startedAt: now,
          lastActivity: now,
          pageViews: 1
        }],
        totalSessions: 1,
        visits: [{ 
          page: page || '/', 
          timestamp: now,
          sessionId: activeSessionId,
          event,
          data
        }],
        userAgent: clientUA,
        device,
        browser,
        os,
        referrer,
        ipAddress: req.ip,
        totalVisits: 1,
        firstVisit: now,
        lastVisit: now
      })
    }
    
    res.json({ 
      success: true, 
      data: {
        visitorId: visitor.visitorId,
        totalVisits: visitor.totalVisits,
        totalSessions: visitor.totalSessions,
        device: visitor.device,
        browser: visitor.browser
      }
    })
  } catch (error) {
    console.error('Error tracking visit:', error)
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Track engagement per project (clicks & dwell time)
exports.trackEngagement = async (req, res) => {
  try {
    const { visitorId, sessionId, projectId, projectTitle, action, dwellSeconds, metadata } = req.body
    
    if (!visitorId || !projectTitle) {
      return res.status(400).json({
        success: false,
        message: 'visitorId and projectTitle are required'
      })
    }

    const todayDate = new Date().toISOString().split('T')[0]
    const engagement = await ProjectEngagement.create({
      projectId: projectId || undefined,
      projectTitle,
      visitorId,
      sessionId: sessionId || 'session-unknown',
      action: action || 'card_click',
      dwellSeconds: Math.min(Math.max(Number(dwellSeconds) || 0, 0), 3600), // Cap dwell to 1 hour max
      metadata: metadata || {},
      date: todayDate
    })

    res.json({
      success: true,
      data: engagement
    })
  } catch (error) {
    console.error('Error tracking engagement:', error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get basic visitor stats
exports.getStats = async (req, res) => {
  try {
    const total = await Visitor.countDocuments()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: today }
    })
    
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: weekAgo }
    })
    
    const visitors = await Visitor.find().select('totalVisits totalSessions')
    const totalPageViews = visitors.reduce((sum, v) => sum + (v.totalVisits || 0), 0)
    const totalSessions = visitors.reduce((sum, v) => sum + (v.totalSessions || 1), 0)
    
    res.json({
      success: true,
      total,
      today: todayVisitors,
      week: weekVisitors,
      totalSessions,
      totalPageViews
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get all visitors for admin audit (clean, anonymous, no fake names)
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ lastVisit: -1 })
      .limit(50)
      .select('visitorId totalVisits totalSessions firstVisit lastVisit device browser os referrer')
    
    // Format respectfully as anonymous identifiers
    const formatted = visitors.map(v => ({
      _id: v._id,
      visitorId: v.visitorId,
      anonymousLabel: `Visitor #${v.visitorId.slice(-4).toUpperCase()}`,
      totalVisits: v.totalVisits,
      totalSessions: v.totalSessions || 1,
      device: v.device || 'Desktop',
      browser: v.browser || 'Other',
      os: v.os || 'Other',
      referrer: v.referrer || 'Direct / Bookmark',
      firstVisit: v.firstVisit,
      lastVisit: v.lastVisit
    }))

    res.json({ 
      success: true, 
      data: formatted 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
