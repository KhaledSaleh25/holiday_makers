const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  // Basic Information
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  supplierType: {
    type: String,
    enum: ['Hotel', 'Transportation', 'Air Transport', 'Visa', 'Sightseeing', 'Assistant', 'Flight', 'Other'],
    required: true
  },
  supplierCode: {
    type: String,
    unique: true
  },
  
  // Contact Information
  telephone: {
    type: String,
    required: [true, 'Telephone is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  fax: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  cardNumber: {
    type: String,
    trim: true
  },
  
  // Address Information
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  stateRegion: {
    type: String,
    trim: true
  },
  address1: {
    type: String,
    trim: true
  },
  address2: {
    type: String,
    trim: true
  },
  zipCode: {
    type: String,
    trim: true
  },
  
  // Business Information
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    trim: true
  },
  mc: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  accountingCode: {
    type: String,
    trim: true
  },
  taxNumber: {
    type: String,
    trim: true
  },
  licenceNumber: {
    type: String,
    trim: true
  },
  
  // Supplier Details
  ownerName: {
    type: String,
    trim: true
  },
  missions: {
    type: String,
    trim: true
  },
  supplierPaymentType: {
    type: String,
    trim: true
  },
  taxPowerName: {
    type: String,
    trim: true
  },
  
  // Additional Fields
  ref: {
    type: String,
    trim: true
  },
  remarkForInvoice: {
    type: String,
    trim: true
  },
  bju: {
    type: String,
    enum: ['Normal', 'Error Test', 'Tax', 'Discount & Collection'],
    default: 'Normal'
  },
  isCustomer: {
    type: Boolean,
    default: false
  },
  
  // File upload (store file path or URL)
  logo: {
    type: String,
    trim: true
  },
  
  // System
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Generate supplier code before saving
supplierSchema.pre('save', async function(next) {
  if (this.isNew && !this.supplierCode) {
    const count = await mongoose.model('Supplier').countDocuments();
    this.supplierCode = `SUP${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for better search performance
supplierSchema.index({ supplierName: 'text', supplierCode: 'text', email: 'text' });

module.exports = mongoose.model('Supplier', supplierSchema);