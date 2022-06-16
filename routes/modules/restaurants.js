const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/restaurantController')

router.get('/', restaurantController.getRestaurants)
router.get('/:restaurantId', restaurantController.getRestaurant)

module.exports = router
