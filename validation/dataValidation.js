const User=require('../models/user')
const { body ,check} = require('express-validator');


const validations = {
  products: [
    body('title').notEmpty().withMessage('Please enter product title'),
    body('price').notEmpty().withMessage('Please enter the price'),
    body('description').notEmpty().withMessage('Please enter the product description'),
    body('image').notEmpty().withMessage('please choose image')
  ],

  registration: [
    check('email').isEmail().withMessage('Please enter a valid email.').custom((value, {req})=>{return User.findOne({ email: value })
  .then((userValidation) => {
      if (userValidation) {
          return Promise.reject('Email exists already,please pick a different one.');           
    }
    })
  }).normalizeEmail(),
   body('password','Please enter a password with only numbers and text and at least 5 characters').isLength({min:5}).isAlphanumeric().trim()
],
login:[
    body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
    body('password','password has to be  valid.').isLength({min:5}).isAlphanumeric().trim()
]
};

module.exports = validations;
