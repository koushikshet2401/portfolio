const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      })
    }
    
    // Check credentials against environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
    
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      return res.status(500).json({
        success: false,
        message: 'Admin credentials not configured'
      })
    }
    
    // Check email
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
    
    // Create JWT token
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    
    res.json({
      success: true,
      token,
      user: { 
        email, 
        role: 'admin' 
      }
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Logout
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })
  
  res.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
}

// Verify token
exports.verifyToken = (req, res) => {
  res.json({ 
    success: true, 
    user: req.user 
  })
}
