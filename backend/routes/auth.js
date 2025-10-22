const express = require('express');
const { body, validationResult } = require('express-validator');
const { login } = require('../controllers/authcontroller');

const router = express.Router();

router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }
  next();
}, login);

module.exports = router;