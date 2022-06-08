const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const User = require('./user')
const Restaurant = require('./restaurant')

const Rating = ramenDB.define(
  'rating',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
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

Restaurant.hasMany(User, {
  through: Rating,
  as: 'RatingAuthors',
  foreignKey: 'authorId'
})

User.hasMany(Restaurant, {
  through: Rating,
  as: 'RatedRestaurants',
  foreignKey: 'restaurantId'
})

module.exports = Rating