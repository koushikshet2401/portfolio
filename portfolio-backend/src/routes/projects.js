const express = require('express')
const router = express.Router()
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/', getAllProjects)
router.get('/:id', getProject)

// Protected routes (require authentication)
router.post('/', protect, createProject)
router.put('/:id', protect, updateProject)
router.delete('/:id', protect, deleteProject)

module.exports = router
