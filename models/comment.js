const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const User = require('./user')
const Restaurant = require('./restaurant')

const Comment = ramenDB.define(
  'comment',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    content: {
      type: DataTypes.TEXT
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
  through: Comment,
  as: 'Commenter',
  foreignKey: 'authorId'
})

User.hasMany(Restaurant, {
  through: Comment,
  as: 'CommentedRestaurants',
  foreignKey: 'restaurantId'
})

module.exports = Comment