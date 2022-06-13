const express = require('express')
const router = express.Router()

const ratingController = require('../../controllers/ratingController')
const { isAuthenticated, isUser } = require('../../middlewares/auth')

router.route('/:restaurantId')
  .all(isAuthenticated, isUser)
  .post(ratingController.rateRestaurant)
  .put(ratingController.editRestaurantRating)
  
module.exports = router