const jwt = require('jsonwebtoken');
const User = require('../models/users');

const protect = async (req, res, next) => {
  let token;

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    return res.status(500).json({ 
      success: false,
      message: 'Server configuration error: JWT_SECRET not defined' 
    });
  }

  // Check if authorization header exists and starts with 'Bearer'
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // Extract token from header
    token = req.headers.authorization.split(' ')[1];
    
    // Check if token exists and is not empty
    if (!token || token.trim() === '') {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, invalid token format' 
      });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, user not found' 
      });
    }
    
    // Add user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Token verification error:', error);
    console.error('Token received:', token ? token.substring(0, 20) + '...' : 'undefined');
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed',
      error: error.message 
    });
  }
};

module.exports = { protect };