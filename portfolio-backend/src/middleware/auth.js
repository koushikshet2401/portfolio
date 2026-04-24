const jwt = require('jsonwebtoken')

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    } 
    // Check for token in cookies
    else if (req.cookies.token) {
      token = req.cookies.token
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      })
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    })
  }
}
