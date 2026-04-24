const Visitor = require('../models/Visitor')

// Track visitor
exports.trackVisit = async (req, res) => {
  try {
    const { visitorId, page, timestamp, userAgent, referrer, event, data } = req.body
    
    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Visitor ID is required'
      })
    }
    
    let visitor = await Visitor.findOne({ visitorId })
    
    if (visitor) {
      // Update existing visitor
      visitor.visits.push({ 
        page, 
        timestamp: timestamp || new Date(),
        event,
        data
      })
      visitor.lastVisit = timestamp || new Date()
      visitor.totalVisits += 1
      await visitor.save()
    } else {
      // Create new visitor
      visitor = await Visitor.create({
        visitorId,
        visits: [{ 
          page, 
          timestamp: timestamp || new Date(),
          event,
          data
        }],
        userAgent,
        referrer,
        ipAddress: req.ip,
        totalVisits: 1
      })
    }
    
    res.json({ 
      success: true, 
      data: visitor 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get visitor stats
exports.getStats = async (req, res) => {
  try {
    // Total unique visitors
    const total = await Visitor.countDocuments()
    
    // Today's visitors
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: today }
    })
    
    // This week's visitors
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const weekVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: weekAgo }
    })
    
    // This month's visitors
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    
    const monthVisitors = await Visitor.countDocuments({
      lastVisit: { $gte: monthAgo }
    })
    
    // Total page views
    const visitors = await Visitor.find()
    const totalPageViews = visitors.reduce((sum, v) => sum + v.totalVisits, 0)
    
    res.json({
      success: true,
      total,
      today: todayVisitors,
      week: weekVisitors,
      month: monthVisitors,
      totalPageViews
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get all visitors (for admin)
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ lastVisit: -1 })
      .limit(100)
    
    res.json({ 
      success: true, 
      data: visitors 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
