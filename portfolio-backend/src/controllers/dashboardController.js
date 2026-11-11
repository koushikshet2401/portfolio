const Visitor = require('../models/Visitor')
const Project = require('../models/Project')
const Internship = require('../models/Internship')
const Certificate = require('../models/Certificate')
const Message = require('../models/Message')
const ProjectEngagement = require('../models/ProjectEngagement')

// Helper to calculate date range
function getDateRange(rangeParam) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let startDate = new Date(todayStart)
  let daysCount = 14

  switch (rangeParam) {
    case 'today':
      daysCount = 1
      startDate = todayStart
      break
    case '7d':
      daysCount = 7
      startDate.setDate(todayStart.getDate() - 6)
      break
    case '14d':
      daysCount = 14
      startDate.setDate(todayStart.getDate() - 13)
      break
    case '30d':
      daysCount = 30
      startDate.setDate(todayStart.getDate() - 29)
      break
    case 'all':
      daysCount = 60
      startDate = new Date(todayStart.getFullYear() - 1, todayStart.getMonth(), todayStart.getDate())
      break
    default:
      daysCount = 14
      startDate.setDate(todayStart.getDate() - 13)
  }

  // Calculate local timezone offset string (e.g. +05:30) for MongoDB date formatting
  const tzOffset = -now.getTimezoneOffset()
  const sign = tzOffset >= 0 ? '+' : '-'
  const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, '0')
  const tzString = `${sign}${pad(tzOffset / 60)}:${pad(tzOffset % 60)}`

  return { startDate, todayStart, daysCount, tzString }
}

// Get complete admin dashboard statistics with date filtering & project engagement
exports.getDashboardStats = async (req, res) => {
  try {
    const range = req.query.range || '14d'
    const { startDate, todayStart, daysCount, tzString } = getDateRange(range)

    // Parallel queries across collections for maximum performance
    const [
      totalUniqueVisitors,
      todayUniqueVisitors,
      todayNewVisitors,
      pageViewsAgg,
      totalSessionsAgg,
      rangeVisitsAgg,
      deviceAgg,
      browserAgg,
      topPagesAgg,
      recentVisitorsDoc,
      projectEngagementsAgg,
      allProjects,
      totalProjects,
      featuredProjects,
      totalInternships,
      totalCertificates,
      totalFeedback,
      unreadFeedback,
      recentFeedback
    ] = await Promise.all([
      // 1. Overall visitor counts
      Visitor.countDocuments(),
      Visitor.countDocuments({ lastVisit: { $gte: todayStart } }),
      Visitor.countDocuments({ firstVisit: { $gte: todayStart } }),
      Visitor.aggregate([
        { $group: { _id: null, total: { $sum: '$totalVisits' } } }
      ]),
      Visitor.aggregate([
        { $group: { _id: null, total: { $sum: '$totalSessions' } } }
      ]),

      // 2. Daily traffic aggregation with timezone aligned formatting
      Visitor.aggregate([
        { $unwind: '$visits' },
        { $match: { 'visits.timestamp': { $gte: startDate } } },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: '%Y-%m-%d', date: '$visits.timestamp', timezone: tzString } },
              visitorId: '$visitorId',
              sessionId: '$visits.sessionId'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.date',
            uniqueVisitors: { $addToSet: '$_id.visitorId' },
            sessions: { $addToSet: '$_id.sessionId' },
            pageViews: { $sum: '$count' }
          }
        },
        {
          $project: {
            _id: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
            sessions: { $size: '$sessions' },
            pageViews: 1
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // 3. Device & Browser demographics
      Visitor.aggregate([
        { $group: { _id: '$device', count: { $sum: 1 } } }
      ]),
      Visitor.aggregate([
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // 4. Most visited routes
      Visitor.aggregate([
        { $unwind: '$visits' },
        { $match: { 'visits.timestamp': { $gte: startDate } } },
        { $group: { _id: '$visits.page', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]),

      // 5. Recent visitors list (anonymous IDs, no fake names)
      Visitor.find()
        .sort({ lastVisit: -1 })
        .limit(10)
        .select('visitorId totalVisits totalSessions firstVisit lastVisit device browser os referrer'),

      // 6. Project engagement aggregation (clicks and dwell time)
      ProjectEngagement.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              projectId: '$projectId',
              projectTitle: '$projectTitle'
            },
            totalClicks: {
              $sum: {
                $cond: [{ $in: ['$action', ['card_click', 'github_click', 'live_demo_click']] }, 1, 0]
              }
            },
            githubClicks: {
              $sum: { $cond: [{ $eq: ['$action', 'github_click'] }, 1, 0] }
            },
            demoClicks: {
              $sum: { $cond: [{ $eq: ['$action', 'live_demo_click'] }, 1, 0] }
            },
            cardClicks: {
              $sum: { $cond: [{ $eq: ['$action', 'card_click'] }, 1, 0] }
            },
            totalDwellSeconds: { $sum: '$dwellSeconds' },
            uniqueVisitors: { $addToSet: '$visitorId' }
          }
        },
        {
          $project: {
            _id: 1,
            projectId: '$_id.projectId',
            projectTitle: '$_id.projectTitle',
            totalClicks: 1,
            githubClicks: 1,
            demoClicks: 1,
            cardClicks: 1,
            totalDwellSeconds: 1,
            uniqueVisitorsEngaged: { $size: '$uniqueVisitors' }
          }
        },
        { $sort: { totalClicks: -1, totalDwellSeconds: -1 } }
      ]),

      // 7. All projects from DB
      Project.find().select('title subtitle badges featured order').sort({ order: 1 }),

      // 8. Other entity counts
      Project.countDocuments(),
      Project.countDocuments({ featured: true }),
      Internship.countDocuments(),
      Certificate.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Message.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select('name email subject message read createdAt')
    ])

    // Build day-by-day continuous timeline for chart
    const trafficMap = new Map()
    rangeVisitsAgg.forEach((item) => {
      trafficMap.set(item._id, {
        uniqueVisitors: item.uniqueVisitors,
        sessions: item.sessions || item.uniqueVisitors,
        pageViews: item.pageViews
      })
    })

    const dailyTraffic = []
    const dayIter = new Date(startDate)
    const today = new Date(todayStart)

    while (dayIter <= today) {
      const dateStr = dayIter.toLocaleDateString('en-CA')
      const dayLabel = dayIter.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
      const entry = trafficMap.get(dateStr) || { uniqueVisitors: 0, sessions: 0, pageViews: 0 }
      dailyTraffic.push({
        date: dateStr,
        label: dayLabel,
        uniqueVisitors: entry.uniqueVisitors,
        sessions: entry.sessions,
        pageViews: entry.pageViews
      })
      dayIter.setDate(dayIter.getDate() + 1)
    }

    // Merge project engagement with all projects
    const engagementMap = new Map()
    projectEngagementsAgg.forEach((item) => {
      const pId = item.projectId ? String(item.projectId) : ''
      const title = (item.projectTitle || '').toLowerCase().trim()
      if (pId) engagementMap.set(pId, item)
      if (title) {
        engagementMap.set(title, item)
        const simplified = title.split(/[—–-]/)[0].trim()
        if (simplified) engagementMap.set(simplified, item)
      }
    })

    const projectAnalytics = allProjects.map((proj) => {
      const projIdStr = String(proj._id)
      const fullTitle = proj.title.toLowerCase().trim()
      const simpleTitle = fullTitle.split(/[—–-]/)[0].trim()

      const match =
        engagementMap.get(projIdStr) ||
        engagementMap.get(fullTitle) ||
        engagementMap.get(simpleTitle)

      return {
        _id: proj._id,
        title: proj.title,
        subtitle: proj.subtitle,
        badges: proj.badges || [],
        featured: proj.featured || false,
        totalClicks: match ? match.totalClicks : 0,
        githubClicks: match ? match.githubClicks : 0,
        demoClicks: match ? match.demoClicks : 0,
        cardClicks: match ? match.cardClicks : 0,
        totalDwellSeconds: match ? match.totalDwellSeconds : 0,
        uniqueVisitorsEngaged: match ? match.uniqueVisitorsEngaged : 0
      }
    })

    // Sort project analytics by total engagement (clicks + dwell seconds)
    projectAnalytics.sort((a, b) => (b.totalClicks * 10 + b.totalDwellSeconds) - (a.totalClicks * 10 + a.totalDwellSeconds))

    // Range Totals
    const rangeUnique = dailyTraffic.reduce((acc, d) => acc + d.uniqueVisitors, 0)
    const rangeSessions = dailyTraffic.reduce((acc, d) => acc + d.sessions, 0)
    const rangePageViews = dailyTraffic.reduce((acc, d) => acc + d.pageViews, 0)

    const totalViews = pageViewsAgg[0]?.total || 0
    const totalAllSessions = totalSessionsAgg[0]?.total || totalUniqueVisitors
    const todayReturningVisitors = Math.max(0, todayUniqueVisitors - todayNewVisitors)

    // Format anonymous visitors list (respectful anonymous tags, NO fake names)
    const recentVisitors = recentVisitorsDoc.map((v) => ({
      _id: v._id,
      visitorId: v.visitorId,
      anonymousLabel: `Visitor #${v.visitorId.slice(-4).toUpperCase()}`,
      totalVisits: v.totalVisits || 1,
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
      data: {
        range,
        summary: {
          rangeUnique,
          rangeSessions,
          rangePageViews,
          avgPagesPerSession: rangeSessions > 0 ? (rangePageViews / rangeSessions).toFixed(1) : '1.0'
        },
        visitors: {
          totalUnique: totalUniqueVisitors,
          todayUnique: todayUniqueVisitors,
          todayNew: todayNewVisitors,
          todayReturning: todayReturningVisitors,
          totalViews,
          totalSessions: totalAllSessions,
          dailyTraffic,
          deviceBreakdown: deviceAgg.map((d) => ({ device: d._id || 'Desktop', count: d.count })),
          browserBreakdown: browserAgg.map((b) => ({ browser: b._id || 'Other', count: b.count })),
          topPages: topPagesAgg.map((p) => ({ page: p._id || '/', count: p.count })),
          recentVisitors
        },
        projectAnalytics,
        projects: {
          total: totalProjects,
          featured: featuredProjects
        },
        internships: {
          total: totalInternships
        },
        certificates: {
          total: totalCertificates
        },
        feedback: {
          total: totalFeedback,
          unread: unreadFeedback,
          recent: recentFeedback
        }
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    })
  }
}
