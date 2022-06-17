const { DataTypes, Op } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Followship } = require('./followship')
const { Role } = require('./role')

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

Role.hasOne(User)
User.belongsTo(Role, {
  foreignKey: 'roleId',
  constraints: false
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followings',
  foreignKey: 'followingId',
  constraints: false
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followers',
  foreignKey: 'followerId',
  constraints: false
})

// query methods
const getUserById = async (userId, isModel) => {
  let options = {}
  if (!isModel) {
    options = {
      raw: true,
      nest: true
    }
  }
  const data = await User.findByPk(userId, options)
  return data
}

const getUserByEmail = async (email) => {
  const data = await User.findOne({
    where: { email },
    raw: true,
    nest: true
  })

  return data
}

const getValidUserById = async (userId) => {
  const data = await User.findOne({
    where: {
      id: userId,
      roleId: {
        [Op.ne]: 1
      },
      isBanned: {
        [Op.ne]: 1
      }
    },
    raw: true,
    nest: true
  })
  return data
}

const getUserWithRelatedData = async (userId, models) => {
  const data = await User.findOne({
    where: {
      id: userId,
      roleId: {
        [Op.ne]: 1
      },
      isBanned: {
        [Op.ne]: 1
      }
    },
    attributes: ['id', 'nick_name', 'description', 'createdAt'],
    include: models,
    nest: true
  })

  return data
}

const getUsersByCategory = async (category, modelConfig) => {
  const data = await User.findAll({
    where: {
      roleId: {
        [Op.ne]: 1 // exclude admin
      }
    },
    attributes: ['id', 'nick_name', 'description', 'isBanned'],
    include: { model: modelConfig[category].model, as: modelConfig[category].tableName },
    nest: true
  })

  return data
}

module.exports = {
  User,
  getUserById,
  getUserByEmail,
  getValidUserById,
  getUserWithRelatedData,
  getUsersByCategory
}
