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
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    roleId: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    }
  },
  { paranoid: true }
)

const getUserById = async (userId) => {
  const data = await User.findByPk(userId, {
    raw: true,
    nest: true
  })
  return data
}

module.exports = {
  User,
  getUserById
}
