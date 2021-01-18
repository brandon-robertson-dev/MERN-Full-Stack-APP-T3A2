const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtToken = process.env.JWTSECRET
const { validationResult } = require('express-validator')

const {
  findUserByEmail,
} = require('../utilities/auth_utilities')

async function registerUserToDatabase(req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  
    const { firstname, lastname, email, password } = req.body
    try{
      let user = await findUserByEmail(email)
      if(user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
      }
      const avatar = gravatar.url(email, {
        size: '200',
        rating: 'pg',
        default: 'mp'
      })
      user = new User({
        firstname,
        lastname,
        email,
        avatar,
        password
      })
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      const payload = {
        user: {
          id: user.id
        }
      }
      jwt.sign(
        payload,
        jwtToken,
        { expiresIn: 360000 },
        (err, token) => {
          if(err) throw err
          res.json({ token })
      })
  
    } catch(err) {
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }

module.exports = {
  registerUserToDatabase
}