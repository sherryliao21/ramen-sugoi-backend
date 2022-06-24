const { DataTypes } = require('sequelize')
const { ramenDB } = require('../databases/mariaDB')
const { Restaurant } = require('./restaurant')
const { User } = require('./user')

const Rating = ramenDB.define(
  'rating',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    stars: {
      type: DataTypes.INTEGER
    },
    authorId: {
      type: DataTypes.INTEGER
    },
    restaurantId: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

Rating.belongsTo(Restaurant, {
  constraints: false
})
Rating.belongsTo(User, {
  constraints: false
})

Restaurant.belongsToMany(User, {
  through: Rating,
  as: 'RatingAuthors',
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Rating,
  as: 'RatedRestaurants',
  foreignKey: 'authorId',
  constraints: false
})

// query methods
const getRating = async (authorId, restaurantId) => {
  const data = await Rating.findOne({
    where: {
      authorId,
      restaurantId
    }
  })
  return data
}

const createRating = async (authorId, restaurantId, stars) => {
  await Rating.create({
    authorId,
    restaurantId,
    stars: parseInt(stars, 10)
  })
}

module.exports = {
  Rating,
  getRating,
  createRating
}
