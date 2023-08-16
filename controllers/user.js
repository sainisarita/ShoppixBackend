const express = require("express");
const {validationResult}=require('express-validator')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require('dotenv').config();

exports.postRegistration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array())
      return res.status(400).json({ errors: errors.array() });
      
    }  
    const { email, password } = req.body;
    console.log(email)
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPassword,
    });

    const result = await user.save();

    console.log("Registration successful");
    res.send(result);
  } catch (err) {
    console.log(err);
    res.send("Error occurred during registration");
  }
};

// Logic for user login
exports.postLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      console.log("Invalid user");
      return res.send("Invalid user");
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (doMatch) {
      const token = jwt.sign(
        { user_id: user._id },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );

      console.log("Login successful");
      res.json({ token: token });
    } else {
      console.log("Invalid password");
      res.send("Invalid password");
    }
  } catch (err) {
    console.log(err);
    res.send("Error occurred during login");
  }
};


 //Logic for user logout 
exports.postLogout=async(req,res)=>{
    try {
        
    } catch (err) {
        
    }
}