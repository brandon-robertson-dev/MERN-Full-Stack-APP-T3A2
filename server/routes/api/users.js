const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const {
  registerUserToDatabase,
} = require('../../controllers/users_controllers')

// REGISTERS A USER TO THE DATABASE
// PUBLIC

router.post('/', 
  [
    check('firstname', 'First name is Required').not().isEmpty(),
    check('lastname', 'Last name is Required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must have 6 or more characters').isLength({ min: 6 })
  ],
  registerUserToDatabase
)

module.exports = router