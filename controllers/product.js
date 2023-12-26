const { validationResult } = require('express-validator');
const Product = require('../models/product');
// const upload= require('../multerSetup/upload')


exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userId = req.user.user_id;
    const { title, price, description } = req.body;
    console.log(req.file,req.body)
    const image = req.file.filename;

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {

        const product = new Product({ title, price, description,image,userId});
        await product.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { title, price, description } = req.body;
    const image = req.file.buffer;

    try {
        await Product.findByIdAndUpdate(productId, { title, price, description,image
        });
        res.json({ message: 'Product updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res, next) => {
    const productId = req.params.productId;

    try {
        await Product.findByIdAndRemove(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
