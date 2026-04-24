const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String
  },
  location: {
    type: String
  },
  resumeUrl: {
    type: String
  },
  profileImage: {
    type: String
  },
  skills: {
    frontend: [String],
    backend: [String],
    tools: [String]
  },
  social: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String
  },
  stats: {
    projects: Number,
    internships: Number,
    efficiency: Number
  }
}, { 
  timestamps: true 
})

module.exports = mongoose.model('Profile', profileSchema)
