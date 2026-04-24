const Message = require('../models/Message')

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
    
    res.json({ 
      success: true, 
      data: messages 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Get single message
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: message 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Create message (contact form submission)
exports.createMessage = async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    }
    
    const message = await Message.create(messageData)
    
    res.status(201).json({ 
      success: true, 
      data: message,
      message: 'Message sent successfully' 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    )
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      })
    }
    
    res.json({ 
      success: true, 
      data: message 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    })
  }
}

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id)
    
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      })
    }
    
    res.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    })
  }
}
