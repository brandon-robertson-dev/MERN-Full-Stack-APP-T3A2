const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')
const jwtToken = config.get('jwtSecret')
const bcrypt = require('bcryptjs')

const {
  findUserByIdForLogin,
  findUserByEmail,
} = require('../utilities/auth_utilities')

async function login(req, res) {
  try {
    const user = await findUserByIdForLogin(req.user.id)
    res.json(user)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Service error')
  }
}

async function authenticateUserGetToken(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body
  try{
    let user = await findUserByEmail(email)
    if(!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
    }
    const payload = {
      user: {
        id: user.id
      }
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })
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
  login,
  authenticateUserGetToken
}