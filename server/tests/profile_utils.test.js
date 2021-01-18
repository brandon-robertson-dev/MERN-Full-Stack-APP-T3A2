const mongoose = require('mongoose')
const expect = require('expect')
// UTILITIES
const profiles = require('../utilities/profile_utilities')
// MODELS
const Profile = require('../models/Profile')
const User = require('../models/User')

const dbConn = 'mongodb://localhost/devconnect_test'

let userId = null

before('connect to db', (done) => {
  User.deleteMany()
  connectToDb(done)
})

after('disconnect db', (done) => {
  mongoose.disconnect(() => done())
})

beforeEach('create profile', async function() {
  genUser = await User.create({
    firstname: 'Brandon',
    lastname: 'Robertson',
    email: 'brandonrobertson23@gmail.com',
    password: '123123'
  })
  userId = genUser._id
  genProfile = await setupProfile(userId)
})

afterEach('delete data', (done) => {
  tearDownData().exec(() => done())
})

describe('findProfiles', () => {
  it('Id Populated', async function() {
    await profiles.findProfileByIdPop(userId).exec((err, profile) => {
      expect(profile.user.firstname).toBe('Brandon')
    })
  })
  it('Id Full', async function() {
    await profiles.findProfileByIdFull(userId).exec((err, profile) => {
      expect(profile.githubusername).toBe('mrgithub')
    })
  })
  it('Id Update', async function() {
    let profileFields = {
      company: 'newCompany'
    }
    await profiles.findByIdUpdate(userId, profileFields).exec(async (err, profile) => {
      let newProfile = await profiles.findProfileByIdFull(profile.user)
      expect(newProfile.company).toBe('newCompany')
    })
  })
  it('All Populated', async function() {
    await profiles.findAllPop().exec((err, profiles) => {
      expect(typeof(profiles)).toBe('object')
    })
  })
  it('Id Remove', async function() {
    await profiles.findAndRemoveProfile().exec(async (err, profile) => {
      let answer = await profiles.findProfileByIdPop(profile.user)
      expect(answer).toBe(null)
    })
  })
})

describe('findProfiles', () => {
  it('Id Populated', async function() {
    await profiles.findProfileByIdPop(userId).exec((err, profile) => {
      expect(profile.user.firstname).not.toBe('Sarah')
    })
  })
  it('Id Full', async function() {
    await profiles.findProfileByIdFull(userId).exec((err, profile) => {
      expect(profile.githubusername).not.toBe('sirgithub')
    })
  })
  it('Id Update', async function() {
    let profileFields = {
      company: 'newCompany'
    }
    await profiles.findByIdUpdate(userId, profileFields).exec(async (err, profile) => {
      let newProfile = await profiles.findProfileByIdFull(profile.user)
      expect(newProfile.company).not.toBe('company')
    })
  })
  it('All Populated', async function() {
    await profiles.findAllPop().exec((err, profiles) => {
      expect(typeof(profiles)).not.toBe('array')
    })
  })
})

describe('findProfiles', () => {
  let fakeId = '5fbd9b0006842b6ca0451032'
  it('Id Populated', async function() {
    await profiles.findProfileByIdPop(fakeId).exec((err, profile) => {
      expect(profile).toBe(null)
    })
  })
  it('Id Full', async function() {
    await profiles.findProfileByIdFull(fakeId).exec((err, profile) => {
      expect(profile).toBe(null)
    })
  })
  it('All Populated', async function() {
    await profiles.findAllPop().exec((err, profiles) => {
      expect(typeof(profiles)).not.toBe('number')
    })
  })
})

function connectToDb(done) {
  mongoose.connect(dbConn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  (err) => {
    if (err) {
      console.log('naw, it aint working', err.message)
      done()
    } else {
      console.log('ye it worked')
      done()
    }
  })
}

function setupProfile(userId) {
  let testProfile = {}
  testProfile.user = userId
  testProfile.company = 'company'
  testProfile.website = 'website'
  testProfile.location = 'locale'
  testProfile.status = 'busy'
  testProfile.bio = 'yo, yo, yooooo'
  testProfile.githubusername = 'mrgithub'
  return Profile.create(testProfile)
}

function tearDownData() {
  return Profile.deleteMany() 
}