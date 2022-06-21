const express = require('express')

const router = express.Router()
const restaurantController = require('../../controllers/restaurantController')

router.get('/', restaurantController.getRestaurants)
router.get('/search', restaurantController.getRestaurantByKeyword)
router.get('/:restaurantId', restaurantController.getRestaurant)
router.get('/:category/top10', restaurantController.getTop10RestaurantsByPopularity)

module.exports = router
