const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.route('/:userId')
  .all(isAuthenticated, isUser)
  .post(followshipController.followUser)
  .delete(followshipController.unfollowUser)

module.exports = router
