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
const {
  findAndRemoveAllUserPosts
} = require('../utilities/posts_utilities')

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
  const { company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin } = req.body

  const profileFields = {
    user: req.user.id,
    company: company,
    website: website,
    location: location,
    bio: bio,
    status: status,
    githubusername: githubusername,
    skills: skills.split(',').map(skill => skill.trim()),
    social: {
      youtube: youtube,
      twitter: twitter,
      facebook: facebook,
      linkedin: linkedin,
      instagram: instagram
    }
  }

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
    await findAndRemoveAllUserPosts(req.user.id)
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
  const { title, company, location, from, to, current, description } = req.body
  const newExp = { title, company, location, from, to, current, description }
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
  const { school, degree, fieldofstudy, from, to, current, description } = req.body
  const newEdu = { school, degree, fieldofstudy, from, to, current, description }
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