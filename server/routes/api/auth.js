const express = require('express')
const router = express.Router()
const {
  login
} = require('../../controllers/auth_controllers')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

router.get('/', auth, login)