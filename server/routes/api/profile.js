const express = require('express')
const router = express.Router()
const {

} = require('../../controllers/profile_controllers')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

module.exports = router