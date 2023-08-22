const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

// Add an item to the cart
exports.addToCart= async (req, res) => {
  try {
    const userId = req.user.user_id
    const { productId, quantity } = req.body;
    console.log(productId)

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const price = parseFloat(product.price);
    const subtotal = price * quantity;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal += subtotal;
    } else {
      cart.items.push({
        productId,
        quantity,
        price,
        subtotal
      });
    }

    cart.total += subtotal;

    await cart.save();

    console.log("Item added to cart successfully");
    res.status(201).json({ message: 'Item added to cart successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while adding item to cart' });
  }
};

// Get the cart for a user
exports.getCart= async (req, res) => {
  try {
    const userId = req.user.user_id
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching the cart' });
  }
};

// Update the cart item quantity
exports.updateCart= async (req, res) => {
  try {
    const userId = req.user.user_id
    const productId = req.params.productId;
    const { quantity } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const price = parseFloat(product.price);
    const oldSubtotal = existingItem.subtotal;
    existingItem.quantity = quantity;
    existingItem.subtotal = price * quantity;

    cart.total += (existingItem.subtotal - oldSubtotal);

    await cart.save();

    console.log("Cart item quantity updated successfully");
    res.status(200).json({ message: 'Cart item quantity updated successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while updating the cart' });
  }
};

// Remove an item from the cart
exports.deleteCart= async (req, res) => {
  try {
    const userId = req.user.user_id
    const productId = req.params.productId;
    

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const removedItem = cart.items.splice(existingItemIndex, 1)[0];
    cart.total -= removedItem.subtotal;

    await cart.save();

    console.log("Item removed from cart successfully");
    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while removing item from cart' });
  }
};


