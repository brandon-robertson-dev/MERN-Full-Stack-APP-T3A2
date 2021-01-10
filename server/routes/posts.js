const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../middleware/auth')

const {
  createPost,
  getAllPosts,
  getPostById,
  deletePostById,
  likePost,
  unlikePost,
  createComment,
  deleteComment
} = require('../controllers/posts_controllers')

// CREATE A POST
// PRIVATE
router.post('/',
[
  auth,
  [
    check('text', 'Text is required').not().isEmpty()
  ]
],
createPost)

// GET ALL POSTS
// PRIVATE
router.get('/', auth, getAllPosts)

//GET POSTS BY ID
// PRIVATE
router.get('/:id', auth, getPostById)

// DELETE POSTS BY ID
// PRIVATE
router.delete('/:id', auth, deletePostById)

// LIKE A POST
// PRIVATE
router.put('/like/:id', auth, likePost)

// UNLIKE A POST
// PRIVATE
router.put('/unlike/:id', auth, unlikePost)


// COMMENT ON A POST
// PRIVATE
router.post('/comment/:id',
[
  auth,
  [
    check('text', 'Text is required').not().isEmpty()
  ]
],
createComment)

// DELETE A COMMENT
// PRIVATE
router.delete('/comment/:id/:comment_id', auth, deleteComment)

module.exports = router