const express = require("express");
require("dotenv").config();
const cors = require('cors');
const multer = require('multer');
const { dbConnect } = require("./config/database");
const productRoutes=require('./routes/product');
const userRoutes=require('./routes/user');
const cartRoutes=require('./routes/cart');
const orderRoutes=require('./routes/order')

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./images"));
app.use(express.json());
// app.use(multer().single('image')); // Add multer middleware here
app.use(cors());



app.use(userRoutes);
app.use(productRoutes);
app.use(cartRoutes);
app.use(orderRoutes);



app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
