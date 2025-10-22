const express = require('express');
const { protect } = require('../middleware/auth');
const Customer = require('../models/customers');

const router = express.Router();

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: customers,
      total: customers.length
    });
  } catch (error) {
    console.error('Customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers'
    });
  }
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, email, phone, country, passportNumber, notes } = req.body;
    
    const customer = await Customer.create({
      name,
      email,
      phone,
      country,
      passportNumber,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating customer'
    });
  }
});

module.exports = router;