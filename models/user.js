const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

const User = ramenDB.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING
    },
    nick_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_pic: {
      type: DataTypes.STRING,
      defaultValue: 'https://imgur.com/Wrdjiye.png'
    },
    description: {
      type: DataTypes.TEXT
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    role_id: {
      type: DataTypes.INTEGER
    },
    favorite_id: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

module.exports = User
