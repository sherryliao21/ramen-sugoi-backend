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
      type: DataTypes.INTEGER,
      defaultValue: 1
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

// query methods
const getCommentCountOnLastPost = async (authorId, restaurantId) => {
  const data = await Comment.findAll({
    where: {
      authorId,
      restaurantId
    },
    order: [['createdAt', 'DESC']],
    limit: 1,
    attributes: ['commentCountOnSamePost'],
    raw: true,
    nest: true
  })
  return data
}

const getLatestVisibleComments = async () => {
  const data = await Comment.findAll({
    order: [['createdAt', 'DESC']],
    where: {
      visibility: 1
    },
    raw: true,
    nest: true,
    attributes: ['id', 'authorId', 'restaurantId', 'content', 'visibility', 'createdAt']
  })
  return data
}

const createComment = async (content) => {
  await Comment.create(content)
}

const getCommentById = async (commentId) => {
  const data = await Comment.findByPk(commentId)
  return data
}

const getComments = async (includeDeleted) => {
  const options = {}
  if (includeDeleted) {
    options.paranoid = false
  }
  const data = await Comment.findAll(options)
  return data
}

module.exports = {
  Comment,
  getCommentCountOnLastPost,
  createComment,
  getCommentById,
  getLatestVisibleComments,
  getComments
}
