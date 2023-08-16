const express = require("express");
const multer=require('multer')
require("dotenv").config();
const { dbConnect } = require("./config/database");
const productRoutes=require('./routes/product');
const userRoutes=require('./routes/user');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(multer().single('image')); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRoutes);
app.use(productRoutes);

app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
