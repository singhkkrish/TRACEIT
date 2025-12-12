const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  // Basic Information
  itemName: {
    type: String,
    required: [true, 'Please provide an item name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Electronics', 'Clothing', 'Accessories', 'Documents', 'Keys', 'Bags', 'Books', 'Other']
  },
  
  // Location & Date
  locationFound: {
    type: String,
    required: [true, 'Please provide the location where item was found'],
    trim: true
  },
  dateFound: {
    type: Date,
    required: [true, 'Please provide the date when item was found']
  },
  
  // Contact phone number
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Security Question (for verification)
  securityQuestion: {
    type: String,
    required: [true, 'Please provide a security question'],
    trim: true
  },
  securityAnswer: {
    type: String,
    required: [true, 'Please provide the security answer'],
    trim: true,
    select: false // Don't return this by default for security
  },
  
  // Photos
  photos: [{
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['found', 'claimed', 'matched'],
    default: 'found'
  },
  
  // User who found the item
  foundBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FoundItem', foundItemSchema);