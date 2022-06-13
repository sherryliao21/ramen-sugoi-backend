const Restaurant = require('../models/restaurant')
const Rating = require('../models/rating')
const { infoLogger, errorLogger, warningLogger } = require('../utils/logger')

const rateRestaurant = async (req, res) => {
  try {
    const userId = req.user.id
    const { restaurantId } = req.params
    const { stars } = req.body
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      warningLogger.warn('ratingController/rateRestaurant: This restaurant does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const rating = await Rating.findOne({
      where: {
        authorId: userId,
        restaurantId
      }
    })
    if (rating) {
      warningLogger.warn('ratingController/rateRestaurant: You already rated this restaurant')
      return res.status(400).send({
        status: 'error',
        message: 'You already rated this restaurant'
      })
    }
    await Rating.create({
      authorId: userId,
      restaurantId,
      stars: parseInt(stars)
    })
    infoLogger.info(`ratingController/rateRestaurant: Rated restaurantId: ${restaurantId} successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Liked restaurantId: ${restaurantId} successfully!`
    })
  } catch (error) {
    errorLogger.error(`ratingController/rateRestaurant: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to rate restaurant'
    })
  }
}

const editRestaurantRating = async (req, res) => {
  try {
    const userId = req.user.id
    const { restaurantId } = req.params
    const { stars } = req.body
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      warningLogger.warn('ratingController/editRestaurantRating: This restaurant does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This restaurant does not exist'
      })
    }
    const rating = await Rating.findOne({
      where: {
        authorId: userId,
        restaurantId
      }
    })
    if (!rating) {
      warningLogger.warn('ratingController/editRestaurantRating: You never rated this restaurant.')
      return res.status(400).send({
        status: 'error',
        message: 'You never rated this restaurant'
      })
    }
    rating.stars = parseInt(stars)
    await rating.save()
    infoLogger.info(`ratingController/editRestaurantRating: Updated restaurantId: ${restaurantId} rating successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Updated restaurantId: ${restaurantId} rating successfully!`
    })
  } catch (error) {
    errorLogger.error(`ratingController/editRestaurantRating: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to update restaurant rating'
    })    
  }
}

module.exports = {
  rateRestaurant,
  editRestaurantRating
}