const { validationResult } = require('express-validator')

const {
  getPostsSorted,
  findPostsById
} = require('../utilities/posts_utilities')
const {
  findByIdNoPassword,
} = require('../utilities/users_utilities')

async function createPost(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await findByIdNoPassword(req.user.id)
    const newPost = new Post({
      text: req.body.text,
      name: `${user.firstname} ${user.lastname}`,
      avatar: user.avatar,
      user: req.user.id
    })
    const post = await newPost.save()
    res.json(post)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await getPostsSorted()
    res.json(posts)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function getPostById(req, res) {
  try {
    const post = await findPostsById(req.params.id)
    if(!post){
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    console.log(err.message)
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
}

async function deletePostById(req, res) {
  try {
    const post = await findPostsById(req.params.id)
    if(post.user.toString() !== req.user.id){
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove()
    res.json({ msg: 'Post removed' })
  } catch (err) {
    console.log(err.message)
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
}

async function likePost(req, res) {
  try {
    const post = await findPostsById(req.params.id)
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }
    post.likes.unshift({ user: req.user.id })
    post.save()
    res.json(post.likes)
  } catch (err) {
    console.log(err.message)
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
}

async function unlikePost(req, res) {
  try {
    const post = await findPostsById(req.params.id)
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post not liked yet' })
    }
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)
    post.save()
    res.json(post.likes)
  } catch (err) {
    console.log(err.message)
    if(err.kind === 'ObjectId'){
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
}

async function createComment(req, res) {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const user = await findByIdNoPassword(req.user.id)
    const post = await findPostsById(req.params.id)
    const newComment = {
      text: req.body.text,
      name: `${user.firstname} ${user.lastname}`,
      avatar: user.avatar,
      user: req.user.id
    }
    post.comments.unshift(newComment)
    post.save()
    res.json(post.comments)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

async function deleteComment(req, res) {
  try {
    const post = await findPostsById(req.params.id)
    const comment = post.comments.find(comment => comment.id === req.params.comment_id)
    if(!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
    post.comments.splice(removeIndex, 1)
    post.save()
    res.json(post.comments)
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error')
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  likePost,
  unlikePost,
  createComment,
  deleteComment
}