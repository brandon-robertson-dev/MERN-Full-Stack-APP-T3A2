const Post = require('../models/Post')

function getPostsSorted() {
  return Post.find().sort({ date: -1 })
}

function findPostsById(id) {
  return Post.findById(id)
}

function findAndRemoveAllUserPosts(id) {
  return Post.deleteMany({ user: id })
}

module.exports = {
  getPostsSorted,
  findPostsById,
  findAndRemoveAllUserPosts
}