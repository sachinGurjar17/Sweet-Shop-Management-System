const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['chocolate', 'candy', 'gummy', 'hard candy', 'lollipop', 'toffee', 'marshmallow', 'other']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    maxlength: 500
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

sweetSchema.index({ name: 'text', category: 'text', description: 'text' });

module.exports = mongoose.model('Sweet', sweetSchema);

