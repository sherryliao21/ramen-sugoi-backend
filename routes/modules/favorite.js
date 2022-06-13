
const express = require('express')
const router = express.Router()

const favoriteController = require('../../controllers/favoriteController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.route('/:restaurantId')
  .all(isAuthenticated, isUser)
  .post(favoriteController.likeRestaurant)
  .delete(favoriteController.unlikeRestaurant)
  
module.exports = router