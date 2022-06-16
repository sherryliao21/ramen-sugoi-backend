const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

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
  },
  {
    paranoid: true
  }
)

module.exports = {
  Comment
}
