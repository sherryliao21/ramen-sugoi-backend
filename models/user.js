const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const Role = require('./role')
const Followship = require('./followship')

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
    roleId: {
      type: DataTypes.INTEGER
    },
    favoriteId: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

Role.hasOne(User)
User.belongsTo(Role, {
  foreignKey: 'roleId'
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followings',
  foreignKey: 'followingId'
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followers',
  foreignKey: 'followerId'
})

module.exports = User
