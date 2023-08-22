const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const authenticateToken=require('../authentication/jwtAuth')

// Create an order
router.post('/order',authenticateToken,orderController.createOrder)

// Get orders for a user
router.get('/orders/:userId',authenticateToken,orderController.getOrdersForUser)

router.post('/confirm-payment',authenticateToken,orderController.confirmPayment )

// Get order details
router.get('/orders/:orderId',authenticateToken,orderController.getOrderDetails)

// Update order status
router.put('/orders/:orderId',authenticateToken,orderController.updateOrderStatus)

// Delete an order
router.delete('/orders/:orderId',authenticateToken,orderController.deleteOrder)



module.exports = router;
