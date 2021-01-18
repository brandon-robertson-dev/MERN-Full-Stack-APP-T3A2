const mongoose = require('mongoose')
const expect = require('expect')
// UTILITIES
const auth = require('../utilities/auth_utilities')
// MODELS
const User = require('../models/User')

const dbConn = 'mongodb://localhost/devconnect_test'

var userId = null

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
  it('should find a user by email', async function() {
    let email = 'brandonrobertson23@gmail.com'
    await auth.findUserByEmail(email).exec((err, returnedUser) => {
      expect(returnedUser.email).toBe(email)
    })
  })
  it('should find a user by id', async function() {
    await auth.findUserByIdForLogin(userId).exec((err, returnedUser) => {
      expect(returnedUser.firstname).toBe('Brandon')
    })
  })
})

describe('should only be Brandon', () => {
  it('not matching emails', async function() {
    let email = 'brandonrobertson23@gmail.com'
    let email2 = 'sarah@google.com'
    await auth.findUserByEmail(email).exec((err, returnedUser) => {
      expect(returnedUser.email).not.toBe(email2)
    })
  })
  it('not matching names', async function() {
    await auth.findUserByIdForLogin(userId).exec((err, returnedUser) => {
      expect(returnedUser.firstname).not.toBe('Sarah')
    })
  })
})

describe('not findUsers', () => {
  it('should not find a user by email', async function() {
    let email = 'sarah@google.com'
    await auth.findUserByEmail(email).exec((err, returnedUser) => {
      expect(returnedUser).toBe(null)
    })
  })
  it('should not find a user by id', async function() {
    let id = '5fbd9b0006842b6ca0451032'
    await auth.findUserByIdForLogin(id).exec((err, returnedUser) => {
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