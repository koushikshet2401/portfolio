const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { protect } = require('../middleware/auth')

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // Generate clean unique filename: project-timestamp.ext
    const cleanExt = path.extname(file.originalname).toLowerCase()
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'upload-' + uniqueSuffix + cleanExt)
  }
})

// File filter (allow images and PDFs)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.pdf']
  const ext = path.extname(file.originalname).toLowerCase()

  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only images (.png, .jpg, .jpeg, .webp, .gif, .svg) and PDFs (.pdf) are allowed!'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  }
})

// Upload route with error handling
router.post('/', protect, (req, res) => {
  // Support both 'file' and 'image' field names
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      })
    }

    const uploadedFile = req.files && req.files.length > 0 ? req.files[0] : req.file

    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: 'No file received by the server. Please select a valid image file.'
      })
    }

    const relativeUrl = `/uploads/${uploadedFile.filename}`
    const PORT = process.env.PORT || 5000
    const fullUrl = `http://localhost:${PORT}${relativeUrl}`

    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: relativeUrl,
      fullUrl: fullUrl,
      data: {
        filename: uploadedFile.filename,
        originalName: uploadedFile.originalname,
        mimeType: uploadedFile.mimetype,
        size: uploadedFile.size,
        url: relativeUrl,
        fullUrl: fullUrl
      }
    })
  })
})

module.exports = router
