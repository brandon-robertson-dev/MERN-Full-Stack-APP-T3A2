const User = require("../models/User")

function findUserByIdForLogin(id) {
  return User.findById(id).select('-password')
}

function findUserByEmail(email) {
  return User.findOne({ email })
}

module.exports = {
  findUserByIdForLogin,
  findUserByEmail,
}