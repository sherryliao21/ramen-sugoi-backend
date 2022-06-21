const { User } = require('../models/index')
const restaurantHelper = require('../models/restaurant')
const { errorLogger, warningLogger } = require('../utils/logger')

const getRestaurants = async (req, res) => {
  try {
    const { categoryId, areaId, isLatest } = req.query
    const restaurants = await restaurantHelper.getRestaurantsByCategories(categoryId, areaId, isLatest)
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
    const includeRelatedTables = true
    const restaurant = await restaurantHelper.getRestaurantById(restaurantId, includeRelatedTables)
    if (!restaurant) {
      warningLogger.warn(`restaurantController/getRestaurant: No restaurant data for id: ${restaurantId}`)
      return res.status(400).send({
        statue: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const response = [restaurant].map((data) => {
      const result = {
        id: data.id,
        name: data.name,
        profilePic: data.profile_pic,
        description: data.description,
        address: data.address,
        category: data.category.name,
        area: data.area.name,
        ratingCount: data.RatingAuthors.length,
        commentCount: data.CommentAuthors.length
      }
      return result
    })
    return res.status(200).send(response)
  } catch (error) {
    errorLogger.error(`restaurantController/getRestaurant: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get restaurant'
    })
  }
}

const getRestaurantByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query
    const restaurants = await restaurantHelper.getRestaurantByKeyword(keyword)
    if (!restaurants) {
      warningLogger.warn('restaurantController/getRestaurant: No restaurant data with this keyword!')
      return res.status(400).send({
        statue: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const response = restaurants.map((data) => {
      const result = {
        id: data.id,
        name: data.name,
        profilePic: data.profile_pic,
        description: data.description,
        address: data.address,
        category: data.category.name,
        area: data.area.name,
        ratingCount: data.RatingAuthors.length,
        commentCount: data.CommentAuthors.length
      }
      return result
    })
    return res.status(200).send(response)
  } catch (error) {
    errorLogger.error(`restaurantController/getRestaurantByKeyword: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get restaurant'
    })
  }
}

const getTop10RestaurantsByPopularity = async (req, res) => {
  try {
    const modelConfig = {
      popular: {
        model: User,
        tableName: 'CommentAuthors',
        count: 'commentCount'
      },
      'highest-rate': {
        model: User,
        tableName: 'RatingAuthors',
        count: 'ratingCount'
      }
    }
    const { category } = req.params
    const restaurants = await restaurantHelper.getRestaurantsByPopularity(category, modelConfig)
    if (!restaurants.length) {
      return res.status(200).send([])
    }
    const result = restaurants
      .filter((restaurant) => !restaurant.isBanned)
      .map((restaurant) => {
        const response = {
          id: restaurant.id,
          name: restaurant.name,
          description: restaurant.description,
          address: restaurant.address,
          profilePic: restaurant.profile_pic,
          [modelConfig[category].count]: restaurant[modelConfig[category].tableName].length
        }
        return response
      })
    const sorted = result.sort((a, b) => b[modelConfig[category].count] - a[modelConfig[category].count]).slice(0, 10)

    return res.status(200).send(sorted)
  } catch (error) {
    const { category } = req.params
    errorLogger.error(`restaurantController/getTop10RestaurantsByPopularity: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: `Unable to get top 10 ${category} restaurants`
    })
  }
}

module.exports = {
  getRestaurants,
  getRestaurant,
  getTop10RestaurantsByPopularity,
  getRestaurantByKeyword
}
