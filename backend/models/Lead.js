const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  probability: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Verified', 'To Check'],
    required: true
  },
  crmSynced: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Lead', leadSchema);