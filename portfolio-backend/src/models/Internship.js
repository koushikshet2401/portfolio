const mongoose = require('mongoose')

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Internship title/role is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  descriptionDesktop: {
    type: String,
    required: [true, 'Desktop description is required']
  },
  descriptionMobile: {
    type: String,
    required: [true, 'Mobile description is required']
  },
  technologies: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
})

// Index for ordering internships
internshipSchema.index({ order: 1, createdAt: -1 })

module.exports = mongoose.model('Internship', internshipSchema)
