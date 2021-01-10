const Post = require('../models/Post')

function getPostsSorted() {
  return Post.find().sort({ date: -1 })
}

function findPostsById(id) {
  return Post.findById(id)
}

module.exports = {
  getPostsSorted,
  findPostsById
}