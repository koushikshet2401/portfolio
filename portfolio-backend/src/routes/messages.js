const express = require('express')
const router = express.Router()
const {
  getAllMessages,
  getMessage,
  createMessage,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController')
const { protect } = require('../middleware/auth')

// Public route - contact form submission
router.post('/', createMessage)

// Protected routes (require authentication)
router.get('/', protect, getAllMessages)
router.get('/:id', protect, getMessage)
router.put('/:id/read', protect, markAsRead)
router.delete('/:id', protect, deleteMessage)

module.exports = router
