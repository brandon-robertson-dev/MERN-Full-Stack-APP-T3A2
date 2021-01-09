const User = require("../models/User")
const bcrypt = require('bcryptjs')

function findUserByIdForLogin(id) {
  return User.findById(id).select('-password')
}

function findUserByEmail(email) {
  return User.findOne(email)
}

function comparePasswords(p1, p2) {
  return bcrypt.compare(p1, p2)
}

module.exports = {
  findUserByIdForLogin,
  findUserByEmail,
  comparePasswords,
}