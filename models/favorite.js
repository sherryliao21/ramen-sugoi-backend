const { DataTypes } = require('sequelize')
const { ramenDB } = require('../databases/mariaDB')
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

// query methods
const getFavorite = async (userId, restaurantId) => {
  const data = await Favorite.findOne({
    where: {
      userId,
      restaurantId
    }
  })
  return data
}

const createFavorite = async (userId, restaurantId) => {
  await Favorite.create({
    userId,
    restaurantId
  })
}

module.exports = {
  Favorite,
  getFavorite,
  createFavorite
}
