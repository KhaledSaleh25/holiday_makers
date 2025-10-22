const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add customer name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please add country'],
    trim: true
  },
  passportNumber: {
    type: String,
    trim: true
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

module.exports = mongoose.model('Customer', customerSchema);