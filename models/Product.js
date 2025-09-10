const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String
  }],
  favoriteCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // createdAt, updatedAt 자동 생성
});

module.exports = mongoose.model('Product', productSchema);
