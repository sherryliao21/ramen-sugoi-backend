const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const User = require('./user')
const Restaurant = require('./restaurant')

const Favorite = ramenDB.define(
  'favorite',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER
    },
    restaurantId: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

Restaurant.hasMany(User, {
  through: Favorite,
  as: 'LikedUsers',
  foreignKey: 'userId'
})

User.hasMany(Restaurant, {
  through: Favorite,
  as: 'LikedRestaurants',
  foreignKey: 'restaurantId'
})

module.exports = Favorite