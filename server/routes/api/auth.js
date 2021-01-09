const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const {
  login,
  authenticateUserGetToken
} = require('../../controllers/auth_controllers')
const auth = require('../../middleware/auth')

router.get('/', auth, login)

router.post('/',
[
  check('email', 'Email is required').isEmail(),
  check('password', 'Password is required').exists()
],
authenticateUserGetToken)

module.exports = router