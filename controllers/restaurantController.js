const { Restaurant } = require('../models/index')
const { errorLogger, warningLogger } = require('../utils/logger')

const getRestaurants = async (req, res) => {
  try {
    const { categoryId, areaId } = req.query
    const keys = {}
    if (categoryId && categoryId.trim()) keys.categoryId = categoryId
    if (areaId && areaId.trim()) keys.areaId = areaId
    const restaurants = await Restaurant.findAll({
      where: keys,
      attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId']
    })
    if (!restaurants.length) {
      warningLogger.warn(`restaurantController/getRestaurants: No restaurant data for category: ${categoryId}, areaId: ${areaId}`)
    }
    return res.status(200).send(restaurants)
  } catch (error) {
    const { categoryId } = req.params
    errorLogger.error(`restaurantController/getRestaurantsByCategory: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: `Unable to get ${categoryId} restaurants`
    })
  }
}

const getRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findByPk(restaurantId, {
      raw: true,
      nest: true
    })
    if (!restaurant) {
      warningLogger.warn(`restaurantController/getRestaurant: No restaurant data for id: ${restaurantId}`)
      return res.status(400).send({
        statue: 'error',
        message: 'This restaurant does not exist'
      })
    }
    return res.status(200).send(restaurant)
  } catch (error) {
    errorLogger.error(`restaurantController/getRestaurantsByCategory: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: `Unable to get ${categoryId} restaurants`
    })
  }
}

module.exports = {
  getRestaurants,
  getRestaurant
}
