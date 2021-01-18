const mongoose = require('mongoose')
const expect = require('expect')
// UTILITIES
const users = require('../utilities/users_utilities')
// MODELS
const User = require('../models/User')

const dbConn = 'mongodb://localhost/devconnect_test'

let userId = null

before('connect to db', (done) => connectToDb(done))

after('disconnect db', (done) => {
  mongoose.disconnect(() => done())
})

beforeEach('create user', async function() {
  genUser = await setupUser()
  userId = genUser._id
})

afterEach('delete data', (done) => {
  tearDownData().exec(() => done())
})

describe('findUsers', () => {
  it('should find and remove user by id', async function() {
    await users.findAndRemoveUser(userId).exec(async (err, returnedUser) => {
      let user = await findByIdNoPassword(returnedUser)
      expect(user).toBe(null)
    })
  })
  it('should find a user by email', async function() {
    let email = 'brandonrobertson23@gmail.com'
    await users.findByIdNoPassword(userId).exec((err, returnedUser) => {
      expect(returnedUser.email).toBe(email)
    })
  })
})

describe('findUsers', () => {
  it('shouldnt find a user', async function() {
    let id = '5ff7af883ed7315bb5a02e7b'
    await users.findAndRemoveUser(id).exec((err, returnedUser) => {
      expect(returnedUser).toBe(null)
    })
  })
  it('should not find sarah', async function() {
    let firstname = 'Sarah'
    await users.findByIdNoPassword(userId).exec((err, returnedUser) => {
      expect(returnedUser.firstname).not.toBe(firstname)
    })
  })
})

describe('findUsers', () => {
  it('shouldnt find a user by id', async function() {
    let id = '5ff7af883ed7315bb5a02e7b'
    await users.findByIdNoPassword(id).exec((err, returnedUser) => {
      expect(returnedUser).toBe(null)
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

function setupUser() {
  let testUser = {}
  testUser.firstname = 'Brandon'
  testUser.lastname = 'Robertson'
  testUser.email = 'brandonrobertson23@gmail.com'
  testUser.password = '123123'
  return User.create(testUser)
}

function tearDownData() {
  return User.deleteMany()
}