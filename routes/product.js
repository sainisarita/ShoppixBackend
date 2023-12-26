const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const productController = require('../controllers/product');
const validation=require('../validation/dataValidation')
const authenticateToken=require('../authentication/jwtAuth')
const upload = require("../multerSetup/upload");


router.get('/products', productController.getProducts);
router.post('/add-product',upload.single('image'),authenticateToken,productController.addProduct);
router.put('/update-product/:productId',authenticateToken,productController.updateProduct);
router.delete('/delete-product/:productId', authenticateToken,productController.deleteProduct);

module.exports = router;
