const { Restaurant, Category, Area, User, Rating, Comment } = require('../models/index')
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
      nest: true,
      attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
      include: [
        { model: User, as: 'RatingAuthors' },
        { model: User, as: 'CommentAuthors' }
      ]
    })
    if (!restaurant) {
      warningLogger.warn(`restaurantController/getRestaurant: No restaurant data for id: ${restaurantId}`)
      return res.status(400).send({
        statue: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const category = await Category.findByPk(restaurant.categoryId, {
      raw: true,
      nest: true,
      attributes: ['name']
    })
    const area = await Area.findByPk(restaurant.areaId, {
      raw: true,
      nest: true,
      attributes: ['name']
    })
    const response = [restaurant].map((data) => {
      const result = {
        id: data.id,
        name: data.name,
        profilePic: data.profile_pic,
        description: data.description,
        address: data.address,
        category: category.name,
        area: area.name,
        ratingCount: restaurant.RatingAuthors.length,
        commentCount: restaurant.CommentAuthors.length
      }
      return result
    })
    return res.status(200).send(response)
  } catch (error) {
    errorLogger.error(`restaurantController/getRestaurant: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: `Unable to get restaurant`
    })
  }
}

const getTop10Restaurants = async (req, res) => {}

module.exports = {
  getRestaurants,
  getRestaurant
}
