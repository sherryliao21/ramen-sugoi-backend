if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

const { ramenDB } = require('../databases/mariaDB')
const { Rating, Comment, Favorite } = require('../models/index')
const { infoLogger, errorLogger } = require('../utils/logger')

const seedRatings = [
  {
    restaurantId: 1,
    authorId: 2,
    stars: 5
  },
  {
    restaurantId: 1,
    authorId: 4,
    stars: 3
  },
  {
    restaurantId: 2,
    authorId: 2,
    stars: 4
  }
]

const seedComments = [
  {
    content: 'GOOD',
    authorId: 2,
    restaurantId: 1
  },
  {
    content: 'OK',
    authorId: 2,
    restaurantId: 2
  },
  {
    content: 'SOSO',
    authorId: 4,
    restaurantId: 2
  }
]

const seedFavorites = [
  {
    userId: 2,
    restaurantId: 1
  },
  {
    userId: 2,
    restaurantId: 3
  },
  {
    userId: 3,
    restaurantId: 2
  }
]

const insertUserActivities = async (ratings, comments, favorites) => {
  try {
    await ramenDB.transaction(async (t) => {
      await Rating.bulkCreate(ratings, { transaction: t })
      await Comment.bulkCreate(comments, { transaction: t })
      await Favorite.bulkCreate(favorites, { transaction: t })
    })

    infoLogger.info('seeders/insertUserActivities: Successfully added seed user activities!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertUserActivities: ${error.stack}`)
  }
}

insertUserActivities(seedRatings, seedComments, seedFavorites)
