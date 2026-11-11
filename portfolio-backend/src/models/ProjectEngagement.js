const mongoose = require('mongoose')

const projectEngagementSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false
  },
  projectTitle: {
    type: String,
    required: true,
    index: true
  },
  visitorId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['card_click', 'github_click', 'live_demo_click', 'dwell'],
    default: 'card_click'
  },
  dwellSeconds: {
    type: Number,
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  date: {
    type: String, // 'YYYY-MM-DD' for high performance date grouping
    index: true
  }
}, {
  timestamps: true
})

projectEngagementSchema.index({ date: 1, projectTitle: 1 })
projectEngagementSchema.index({ createdAt: -1 })
projectEngagementSchema.index({ visitorId: 1, action: 1 })
projectEngagementSchema.index({ projectTitle: 1, action: 1, createdAt: -1 })
projectEngagementSchema.index({ date: -1, action: 1 })

module.exports = mongoose.model('ProjectEngagement', projectEngagementSchema)
