const express = require('express');
const Order = require('../models/order');
const Product = require('../models/product');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: 'rzp_test_H9TMW8J2mNpila',
  key_secret: 'vYIuRshzKpMM1PwsJVppQ2jn',
});

exports.createOrder = async (userId, items) => {
  try {
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      total += subtotal;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
    }

    if (orderItems.length === 0) {
      throw new Error('No valid items found for the order');
    }

    const options = {
      total: Math.round(total * 100), 
      currency: 'INR',
      receipt: 'order_receipt',
      payment_capture: 1, 
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = new Order({
      userId,
      items: orderItems,
      total,
      status: 'Pending',
      paymentIntentId: razorpayOrder.id, 
    });

    await order.save();

    return { order, orderId: razorpayOrder.id };
  } catch (error) {
    throw new Error(`Failed to create order and initiate payment: ${error.message}`);
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ paymentIntentId: orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment status with Razorpay
    const paymentStatus = await razorpay.payments.fetch(orderId);

    if (paymentStatus.status === 'captured') {
      // Update payment status and order status
      order.paymentStatus = 'Paid';
      order.status = 'Confirmed';
      await order.save();

      res.status(200).json({ message: 'Payment confirmed and order updated' });
    } else {
      res.status(400).json({ message: 'Payment confirmation failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while confirming payment' });
  }
};
  

// get all order for user
exports.getOrdersForUser = async (userId) => {
    try {
      const orders = await Order.find({ userId }).sort('-createdAt');
      return orders;
    } catch (error) {
      throw error;
    }
  };
  
//get order detail of user
exports.getOrderDetails = async (orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw error;
    }
  };
  
// update order status
exports.updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      order.status = newStatus;
      await order.save();
      return order;
    } catch (error) {
      throw error;
    }
  };

// delete order
exports.deleteOrder = async (orderId) => {
    try {
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    } catch (error) {
      throw error;
    }
  };
  

