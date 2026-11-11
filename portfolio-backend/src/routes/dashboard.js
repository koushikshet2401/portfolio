const express = require('express')
const router = express.Router()
const { getDashboardStats } = require('../controllers/dashboardController')
const { protect } = require('../middleware/auth')

// Protected route for complete admin dashboard statistics
router.get('/stats', protect, getDashboardStats)

module.exports = router
