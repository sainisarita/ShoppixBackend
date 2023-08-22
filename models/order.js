const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  subtotal: {
    type: mongoose.Types.Decimal128,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  paymentIntentId: String, // Store Stripe Payment Intent ID
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
