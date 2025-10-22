const express = require('express');
const { protect } = require('../middleware/auth');
const Reservation = require('../models/Reservation');

const router = express.Router();

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: reservations,
      total: reservations.length
    });
  } catch (error) {
    console.error('Reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservations'
    });
  }
});

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { customer, type, destination, checkIn, checkOut, passengers, amount, notes } = req.body;
    
    const reservation = await Reservation.create({
      customer,
      type,
      destination,
      checkIn,
      checkOut,
      passengers,
      amount,
      notes,
      createdBy: req.user._id
    });

    // Populate customer details in response
    await reservation.populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating reservation'
    });
  }
});

module.exports = router;