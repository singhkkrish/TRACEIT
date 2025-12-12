const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
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
  
  // Description
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  // Location & Date
  locationLost: {
    type: String,
    required: [true, 'Please provide the location where item was lost'],
    trim: true
  },
  dateLost: {
    type: Date,
    required: [true, 'Please provide the date when item was lost']
  },
  
  // Contact phone number
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Photos
  photos: [{
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['lost', 'found', 'matched'],
    default: 'lost'
  },
  
  // User who reported
  reportedBy: {
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

module.exports = mongoose.model('Item', itemSchema);