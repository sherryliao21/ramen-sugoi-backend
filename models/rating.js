const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

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

module.exports = {
  Rating
}
