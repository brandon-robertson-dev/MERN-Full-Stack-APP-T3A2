const Profile = require('../models/Profile')

function findProfileByIdPop(id) {
  return Profile.findOne({ user: id }).populate('user', ['firstname', 'lastname', 'avatar'])
}

function findProfileByIdFull(id) {
  return Profile.findOne({ user: id })
}

function findByIdUpdate(id) {
  return Profile.findOneAndUpdate({ user: id }, { $ser: profileFields }, { new: true })
}

function findAllPop() {
  return Profile.find().populate('user', ['name', 'avatar'])
}

function findAndRemoveProfile(id) {
  return Profile.findOneAndRemove({ user: id })
}

module.exports = {
  findProfileByIdPop,
  findProfileByIdFull,
  findByIdUpdate,
  findAllPop,
  findAndRemoveProfile
}