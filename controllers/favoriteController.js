const Favorite = require('../models/favorite')
const Restaurant = require('../models/restaurant')
const { infoLogger, errorLogger, warningLogger } = require('../utils/logger')

const likeRestaurant = async (req, res) => {
  try {
    const userId = req.user.id
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      warningLogger.warn('favoriteController/likeRestaurant: This restaurant does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const favorite = await Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
    if (favorite) {
      warningLogger.warn('favoriteController/likeRestaurant: You already liked this restaurant.')
      return res.status(400).send({
        status: 'error',
        message: 'You already liked this restaurant'
      })
    }
    await Favorite.create({
      userId,
      restaurantId
    })
    infoLogger.info(`favoriteController/likeRestaurant: Liked restaurantId: ${restaurantId} successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Liked restaurantId: ${restaurantId} successfully!`
    })
  } catch (error) {
    errorLogger.error(`favoriteController/likeRestaurant: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to like restaurant'
    })
  }
}

const unlikeRestaurant = async (req, res) => {
  try {
    const userId = req.user.id
    const { restaurantId } = req.params
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      warningLogger.warn('favoriteController/unlikeRestaurant: This restaurant does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const favorite = await Favorite.findOne({
      where: {
        userId,
        restaurantId
      }
    })
    if (!favorite) {
      warningLogger.warn('favoriteController/unlikeRestaurant: You never liked this restaurant.')
      return res.status(400).send({
        status: 'error',
        message: 'You never liked this restaurant'
      })
    }
    await favorite.destroy()
    infoLogger.info(`favoriteController/unlikeRestaurant: Unliked restaurantId: ${restaurantId} successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Unliked restaurantId: ${restaurantId} successfully!`
    })
  } catch (error) {
    errorLogger.error(`favoriteController/unlikeRestaurant: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to unlike restaurant'
    })    
  }
}

module.exports = {
  likeRestaurant,
  unlikeRestaurant
}