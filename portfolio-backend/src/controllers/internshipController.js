const Internship = require('../models/Internship')

// Get all internships
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find()
      .sort({ order: 1, createdAt: -1 })
    
    res.json({ 
      success: true, 
      data: internships 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get single internship
exports.getInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id)
    
    if (!internship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Internship not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: internship 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Create internship
exports.createInternship = async (req, res) => {
  try {
    const internship = await Internship.create(req.body)
    
    res.status(201).json({ 
      success: true, 
      data: internship 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Update internship
exports.updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!internship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Internship not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: internship 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Delete internship
exports.deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id)
    
    if (!internship) {
      return res.status(404).json({ 
        success: false, 
        message: 'Internship not found' 
      })
    }
    
    res.json({ 
      success: true, 
      message: 'Internship deleted successfully' 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
