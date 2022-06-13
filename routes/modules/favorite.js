
const express = require('express')
const router = express.Router()
const favoriteController = require('../../controllers/favoriteController')

router.route('/:restaurantId')
  .post(favoriteController.likeRestaurant)
  .delete(favoriteController.unlikeRestaurant)
  
module.exports = router