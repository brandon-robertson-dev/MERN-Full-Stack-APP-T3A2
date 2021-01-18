const mongoose = require('mongoose')
const expect = require('expect')
// UTILITIES
const posts = require('../utilities/posts_utilities')
// MODELS
const Post = require('../models/Post')

const dbConn = 'mongodb://localhost/devconnect_test'

let postId = null

before('connect to db', (done) => connectToDb(done))

after('disconnect db', (done) => {
  mongoose.disconnect(() => done())
})

beforeEach('create post', async function() {
  genPost = await setupPost()
  postId = genPost._id
})

afterEach('delete data', (done) => {
  tearDownData().exec(() => done())
})

describe('findPosts', () => {
  it('find all posts', async function() {
    await posts.getPostsSorted().exec((err, posts) => {
      expect(typeof(posts)).toBe('object')
    })
  })
  it('find post by id', async function() {
    await posts.findPostsById(postId).exec((err, post) => {
      expect(post.text).toBe('This is a test post')
    })
  })
})

describe('not findPosts', () => {
  it('find all posts', async function() {
    await posts.getPostsSorted().exec((err, posts) => {
      expect(typeof(posts)).not.toBe('array')
    })
  })
  it('dont find post by id', async function() {
    await posts.findPostsById(postId).exec((err, post) => {
      expect(post.name).not.toBe('Sarah')
    })
  })
})

describe('findPosts', () => {
  it('find all posts', async function() {
    await posts.getPostsSorted().exec((err, posts) => {
      expect(typeof(posts)).not.toBe(null)
    })
  })
  it('find post by id', async function() {
    let id = '5fbd9b0006842b6ca0451032'
    await posts.findPostsById(id).exec((err, post) => {
      expect(post).toBe(null)
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

function setupPost() {
  let testPost = {}
  testPost.user = '5ff7af883ed7315bb5a02e7b'
  testPost.text = 'This is a test post'
  testPost.name = 'Brandon Robertson'
  testPost.avatar = 'www.gravatar.com/avatar/2ad4fe57c06b697c449a231cf64a4a31?size=200&rating=pg&default=mp'
  return Post.create(testPost)
}

function tearDownData() {
  return Post.deleteMany()
}