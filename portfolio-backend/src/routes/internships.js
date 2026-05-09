const express = require('express')
const router = express.Router()
const {
  getAllInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/', getAllInternships)
router.get('/:id', getInternship)

// Protected routes (require authentication)
router.post('/', protect, createInternship)
router.put('/:id', protect, updateInternship)
router.delete('/:id', protect, deleteInternship)

module.exports = router
