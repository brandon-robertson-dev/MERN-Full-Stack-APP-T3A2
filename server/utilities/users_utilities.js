const User = require('../models/User')

function findAndRemoveUser(id) {
  return User.findOneAndRemove({ _id: id })
}

function findByIdNoPassword(id) {
  return User.findById(id).select('-password')
}

module.exports = {
  findAndRemoveUser,
  findByIdNoPassword
}