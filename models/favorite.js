const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

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

module.exports = {
  Favorite
}
