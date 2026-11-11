const mongoose = require('mongoose')

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Certificate title is required'],
    trim: true
  },
  issuer: {
    type: String,
    required: [true, 'Issuer organization is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    trim: true
  },
  issueDate: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true,
    default: ''
  },
  file: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    default: 'fas fa-award'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

certificateSchema.index({ order: 1, createdAt: -1 })

module.exports = mongoose.model('Certificate', certificateSchema)
