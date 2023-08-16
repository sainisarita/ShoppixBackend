const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/product');
const validation=require('../validation/dataValidation')
const authenticateToken=require('../authentication/jwtAuth')

router.get('/products', productController.getProducts);
router.post('/add-product', validation.products,productController.addProduct);
router.put('/update-product/:productId',validation.products, productController.updateProduct);
router.delete('/delete-product/:productId', productController.deleteProduct);

module.exports = router;
