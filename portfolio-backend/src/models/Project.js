const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  image: {
    type: String,
    required: [true, 'Project image URL is required']
  },
  githubLink: {
    type: String,
    required: [true, 'GitHub link is required']
  },
  liveLink: {
    type: String,
    default: ''
  },
  technologies: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
})

// Index for faster queries
projectSchema.index({ order: 1, createdAt: -1 })

module.exports = mongoose.model('Project', projectSchema)
