const Reservation = require('../models/Reservation');
const Customer = require('../models/customers');
const Invoice = require('../models/Invoice');

// @desc    Get all reservations with search and filters
// @route   GET /api/reservations
// @access  Private
exports.getReservations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      type, 
      status, 
      startDate, 
      endDate 
    } = req.query;

    let query = {};

    // Search by customer name or reservation number
    if (search) {
      const customers = await Customer.find({
        name: { $regex: search, $options: 'i' }
      }).select('_id');
      
      query.$or = [
        { reservationNumber: { $regex: search, $options: 'i' } },
        { customer: { $in: customers.map(c => c._id) } }
      ];
    }

    // Filter by type
    if (type) query.type = type;
    
    // Filter by status
    if (status) query.status = status;
    
    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const reservations = await Reservation.find(query)
      .populate('customer', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Reservation.countDocuments(query);

    res.json({
      success: true,
      data: reservations,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReservations: total
      }
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservations'
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('customer')
      .populate('createdBy', 'name email');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reservation'
    });
  }
};

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
exports.createReservation = async (req, res) => {
  try {
    const {
      customer,
      type,
      destination,
      checkIn,
      checkOut,
      passengers,
      amount,
      currency,
      followUp,
      invoiceNumber,
      invoiceDate,
      invoiceNotes,
      salesOfficer,
      branch,
      ledger,
      relatedAccount,
      notes
    } = req.body;

    const reservation = await Reservation.create({
      customer,
      type,
      destination,
      checkIn,
      checkOut,
      passengers,
      amount,
      currency,
      followUp,
      invoiceNumber,
      invoiceDate,
      invoiceNotes,
      salesOfficer,
      branch,
      ledger,
      relatedAccount,
      notes,
      createdBy: req.user._id
    });

    await reservation.populate('customer', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Reservation number already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating reservation'
    });
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone');

    res.json({
      success: true,
      message: 'Reservation updated successfully',
      data: updatedReservation
    });
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating reservation'
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting reservation'
    });
  }
};