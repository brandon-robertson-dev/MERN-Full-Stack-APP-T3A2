const express = require('express')
const router = express.Router()
const {
  registerUserToDatabase,
  
} = require('../../controllers/users_controllers')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

// REGISTERS A USER TO THE DATABASE
// PUBLIC

router.post('/register', 
  [
    check('firstname', 'First name is Required').not().isEmpty(),
    check('lastname', 'Last name is Required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password must have 6 or more characters').isLength({ min: 6 })
  ],
  registerUserToDatabase
)