const Profile = require('../models/Profile')

// Get profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne()
    
    // If no profile exists, return empty profile structure
    if (!profile) {
      return res.json({ 
        success: true, 
        data: null,
        message: 'No profile found. Please create one.' 
      })
    }
    
    res.json({ 
      success: true, 
      data: profile 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne()
    
    if (!profile) {
      // Create new profile if doesn't exist
      profile = await Profile.create(req.body)
    } else {
      // Update existing profile
      profile = await Profile.findByIdAndUpdate(
        profile._id,
        req.body,
        { new: true, runValidators: true }
      )
    }
    
    res.json({ 
      success: true, 
      data: profile,
      message: 'Profile updated successfully' 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}
