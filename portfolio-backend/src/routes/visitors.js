const express = require('express')
const router = express.Router()
const {
  trackVisit,
  getStats,
  getAllVisitors
} = require('../controllers/visitorController')
const { protect } = require('../middleware/auth')

// Public route - track visitor
router.post('/track', trackVisit)

// Protected routes (require authentication)
router.get('/stats', protect, getStats)
router.get('/', protect, getAllVisitors)

module.exports = router
