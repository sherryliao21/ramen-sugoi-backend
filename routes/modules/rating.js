const express = require('express')

const router = express.Router()
const ratingController = require('../../controllers/ratingController')

router.route('/:restaurantId').post(ratingController.rateRestaurant).put(ratingController.editRestaurantRating)

module.exports = router
