const { validationResult } = require('express-validator');
const gitClient = process.env.GITHUBCLIENT
const gitSecret = process.env.GITHUBSECRET
const request = require('request');

const {
  findProfileByIdPop,
  findProfileByIdFull,
  findByIdUpdate,
  findAllPop,
  findAndRemoveProfile
} = require('../utilities/profile_utilities')
const {
  findAndRemoveUser
} = require('../utilities/users_utilities')

async function getLoggedInUser(req, res) {
  try {
    const profile = await findProfileByIdFull(req.user.id)
    if(!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server error')
  }
}

async function createUpdateProfile(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
  } = req.body
  
  const profileFields = {}
  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills
  }
  
  profileFields.social = {}

  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try{
    let profile = await findProfileByIdFull(req.user.id)
    if(profile) {
      profile = await findByIdUpdate(req.user.id, profileFields)
      return res.json(profile)
    }
    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function getAllProfiles(req, res) {
  try{
    const profiles = await findAllPop()
    res.json(profiles)
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function getUserById(req, res) {
  try{
    const profile = await findProfileByIdPop(req.params.user_id)
    if(!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.json(profile)
  } catch(err) {
    console.log(err.message)
    if(err.kind === 'ObjectId'){
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server Error')
  }
}

async function deleteProfile(req, res) {
  try{
    await findAndRemoveProfile(req.user.id)
    await findAndRemoveUser(req.user.id)
    res.json({ msg: 'User deleted' })
  } catch(err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function addExperience(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body
  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await findProfileByIdFull(req.user.id)
    profile.experience.unshift(newExp)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function deleteExperience(req, res) {
  try {
    const profile = await findProfileByIdFull(req.user.id)
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function addEducation(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body
  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await findProfileByIdFull(req.user.id)
    profile.education.unshift(newEdu)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function deleteEducation(req, res) {
  try {
    const profile = await findProfileByIdFull(req.user.id )
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

function getReposGithub(req, res) {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${gitClient}&client_secret${gitSecret}`,
      method: 'GET',
      headers: { 'user-agent' : 'node.js' }
    }
    request(options, (error, response, body) => {
      if(error) console.log(error)
      if(res.statusCode !== 200) { response.status(404).json({ msg: 'No Github profile found' })}
      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
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
}