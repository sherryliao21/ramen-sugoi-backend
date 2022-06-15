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

Restaurant.belongsToMany(User, {
  through: Rating,
  as: 'RatingAuthors',
  foreignKey: 'restaurantId'
})

User.belongsToMany(Restaurant, {
  through: Rating,
  as: 'RatedRestaurants',
  foreignKey: 'authorId'
})

module.exports = Rating
