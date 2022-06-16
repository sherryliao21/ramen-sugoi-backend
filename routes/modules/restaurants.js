const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurantController')

router.get('/', restaurantController.getRestaurants)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('/:category/top10', restaurantController.getTop10RestaurantsByCategory)

module.exports = router
