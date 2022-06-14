const express = require('express')
const router = express.Router()
const commentController = require('../../controllers/commentController')

router.post('/', commentController.postComment)
router.route('/:commentId')
  .put(commentController.editComment)
  .delete(commentController.deleteComment)

module.exports = router
