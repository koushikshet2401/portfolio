const express = require('express')
const router = express.Router()
const {
  getAllCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
} = require('../controllers/certificateController')
const { protect } = require('../middleware/auth')

// Public routes
router.get('/', getAllCertificates)
router.get('/:id', getCertificate)

// Protected routes (Admin only)
router.post('/', protect, createCertificate)
router.put('/:id', protect, updateCertificate)
router.delete('/:id', protect, deleteCertificate)

module.exports = router
