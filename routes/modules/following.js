const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')

router.route('/:userId')
  .post(followshipController.followUser)
  .delete(followshipController.unfollowUser)

module.exports = router
