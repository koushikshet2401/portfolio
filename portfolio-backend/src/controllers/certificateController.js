const Certificate = require('../models/Certificate')

// Get all certificates
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .sort({ order: 1, createdAt: -1 })
    
    res.json({ 
      success: true, 
      count: certificates.length,
      data: certificates 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get single certificate
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
    
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: certificate 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Create certificate
exports.createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body)
    
    res.status(201).json({ 
      success: true, 
      data: certificate 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Update certificate
exports.updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: certificate 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Delete certificate
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id)
    
    if (!certificate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Certificate not found' 
      })
    }
    
    res.json({ 
      success: true, 
      message: 'Certificate deleted successfully' 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
