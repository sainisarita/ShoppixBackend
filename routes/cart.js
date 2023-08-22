const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const cartController = require('../controllers/cart');
const authenticateToken=require('../authentication/jwtAuth')

router.post('/addcart',authenticateToken,cartController.addToCart)
router.get('/cart',authenticateToken,cartController.getCart)
router.put('/cart/:productId',authenticateToken,cartController.updateCart)
router.delete('/cart/:productId',authenticateToken,cartController.deleteCart)

module.exports = router;
