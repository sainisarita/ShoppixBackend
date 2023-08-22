const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
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

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  items: [cartItemSchema],
  total: {
    type: mongoose.Types.Decimal128,
    required: true
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
