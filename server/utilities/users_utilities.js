const User = require('../models/User')

function findAndRemoveUser(id) {
  return User.findOneAndRemove({ _id: id })
}

module.exports = {
  findAndRemoveUser,
}