const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile
} = require('../controllers/profileController')
const { protect } = require('../middleware/auth')

// Public route
router.get('/', getProfile)

// Protected route (require authentication)
router.put('/', protect, updateProfile)

module.exports = router
