const express = require('express')
const router = express.Router()
const {
  trackVisit,
  trackEngagement,
  getStats,
  getAllVisitors
} = require('../controllers/visitorController')
const { protect } = require('../middleware/auth')

// Public routes - anonymous tracking
router.post('/track', trackVisit)
router.post('/engagement', trackEngagement)

// Protected routes (require authentication)
router.get('/stats', protect, getStats)
router.get('/', protect, getAllVisitors)

module.exports = router
