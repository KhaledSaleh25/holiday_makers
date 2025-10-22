const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'visa', 'transportation', 'tour', 'package'],
    required: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  checkIn: {
    type: Date
  },
  checkOut: {
    type: Date
  },
  passengers: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);