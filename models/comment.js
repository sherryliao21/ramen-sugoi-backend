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
      unique: true,
      autoIncrement: true
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
  }, {
    paranoid: true
  }
)

Comment.belongsTo(Restaurant)
Comment.belongsTo(User)

Restaurant.belongsToMany(User, {
  through: Comment,
  as: 'CommentAuthors',
  foreignKey: 'authorId'
})

User.belongsToMany(Restaurant, {
  through: Comment,
  as: 'CommentedRestaurants',
  foreignKey: 'restaurantId'
})

module.exports = Comment
