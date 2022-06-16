const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Restaurant } = require('./restaurant')
const { User } = require('./user')

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
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Favorite,
  as: 'LikedRestaurants',
  foreignKey: 'userId',
  constraints: false
})

module.exports = {
  Favorite
}
