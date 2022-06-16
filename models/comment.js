const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Restaurant } = require('./restaurant')
const { User } = require('./user')

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
    },
    commentCountOnSamePost: {
      type: DataTypes.INTEGER
    }
  },
  {
    paranoid: true
  }
)

Comment.belongsTo(Restaurant, {
  constraints: false
})
Comment.belongsTo(User, {
  constraints: false
})

Restaurant.belongsToMany(User, {
  through: Comment,
  as: 'CommentAuthors',
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Comment,
  as: 'CommentedRestaurants',
  foreignKey: 'authorId',
  constraints: false
})

module.exports = {
  Comment
}
