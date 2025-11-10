const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  reservationNumber: {
    type: String,
    unique: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'transportation', 'visa', 'tour', 'package'],
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
  currency: {
    type: String,
    default: 'EGP'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  followUp: {
    type: Date
  },
  invoiceNumber: {
    type: String
  },
  invoiceDate: {
    type: Date
  },
  invoiceNotes: {
    type: String,
    trim: true
  },
  salesOfficer: {
    type: String,
    trim: true
  },
  branch: {
    type: String,
    trim: true
  },
  ledger: {
    type: String,
    trim: true
  },
  relatedAccount: {
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

// Generate reservation number before saving
reservationSchema.pre('save', async function(next) {
  if (this.isNew && !this.reservationNumber) {
    try {
      const count = await mongoose.model('Reservation').countDocuments();
      this.reservationNumber = `RES${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      console.error('Error generating reservation number:', error);
      // Fallback to timestamp-based number
      this.reservationNumber = `RES${Date.now().toString().slice(-6)}`;
    }
  }
  next();
});

module.exports = mongoose.model('Reservation', reservationSchema);