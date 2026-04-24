const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  visitorId: {
    type: String,
    required: true,
    unique: true,
    index: true
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
    event: String,
    data: mongoose.Schema.Types.Mixed
  }],
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  },
  totalVisits: {
    type: Number,
    default: 1
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

// Index for stats queries
visitorSchema.index({ lastVisit: -1 })
visitorSchema.index({ firstVisit: -1 })

module.exports = mongoose.model('Visitor', visitorSchema)
