const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { check } = require('express-validator')

const {
  getLoggedInUser,
  createUpdateProfile,
  getAllProfiles,
  getUserById,
  deleteProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  getReposGithub
} = require('../controllers/profile_controllers')

// GET LOGGED IN USER PROFILE
// PRIVATE
router.get('/me', auth, getLoggedInUser)

// CREATE OR UPDATE USER PROFILE
// PRIVATE
router.post('/',
[
  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
  ]
],
createUpdateProfile)

// GET ALL PROFILES
// PUBLIC
router.get('/all', getAllProfiles)

// GET PROFILE BY ID
// PUBLIC
router.get('/user/:user_id', getUserById)

// DELETE PROFILE, USER & POSTS
// PRIVATE
router.delete('/', auth, deleteProfile)

// ADD PROFILE EXPERIENCE
// PRIVATE
router.put('/experience',
[
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
  ]
],
addExperience)

// DELETE EXPERIENCE
// PRIVATE
router.delete('/experience/:exp_id', auth, deleteExperience)

// ADD PROFILE EDUCATION
// PRIVATE
router.put('/education',
[
  auth,
  [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
  ]
],
addEducation)

// DELETE EDUCATION
// PRIVATE
router.delete('/education/:edu_id', auth, deleteEducation)

// GET USER REPOS FROM GITHUB
// PUBLIC
router.get('/github/:username', getReposGithub)

module.exports = router