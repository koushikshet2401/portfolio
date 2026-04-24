const express = require('express')
const router = express.Router()
const {
  login,
  logout,
  verifyToken
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')

// Public routes
router.post('/login', login)
router.post('/logout', logout)

// Protected route
router.get('/verify', protect, verifyToken)

module.exports = router
