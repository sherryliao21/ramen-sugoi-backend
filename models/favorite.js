const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const User = require('./user')
const Restaurant = require('./restaurant')

const Favorite = ramenDB.define('favorite', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER
  },
  restaurantId: {
    type: DataTypes.INTEGER
  }
})

Restaurant.belongsToMany(User, {
  through: Favorite,
  as: 'LikedUsers',
  foreignKey: 'restaurantId'
})

User.belongsToMany(Restaurant, {
  through: Favorite,
  as: 'LikedRestaurants',
  foreignKey: 'userId'
})

module.exports = Favorite
