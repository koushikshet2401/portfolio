const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  sessions: [{
    sessionId: {
      type: String,
      required: true
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    pageViews: {
      type: Number,
      default: 1
    }
  }],
  totalSessions: {
    type: Number,
    default: 1
  },
  visits: [{
    page: {
      type: String,
      default: '/'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    sessionId: String,
    event: String,
    data: mongoose.Schema.Types.Mixed
  }],
  firstVisit: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastVisit: {
    type: Date,
    default: Date.now,
    index: true
  },
  totalVisits: {
    type: Number,
    default: 1
  },
  device: {
    type: String,
    default: 'Desktop'
  },
  browser: {
    type: String,
    default: 'Other'
  },
  os: {
    type: String,
    default: 'Other'
  },
  userAgent: {
    type: String
  },
  referrer: {
    type: String
  },
  ipAddress: {
    type: String
  }
}, { 
  timestamps: true 
})

// Compound and single indexes for analytics & hot queries
visitorSchema.index({ lastVisit: -1 })
visitorSchema.index({ firstVisit: -1 })
visitorSchema.index({ 'sessions.sessionId': 1 })
visitorSchema.index({ 'visits.timestamp': -1 })
visitorSchema.index({ 'visits.page': 1, 'visits.timestamp': -1 })
visitorSchema.index({ device: 1, lastVisit: -1 })
visitorSchema.index({ browser: 1, lastVisit: -1 })

module.exports = mongoose.model('Visitor', visitorSchema)
