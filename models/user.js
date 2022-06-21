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
      defaultValue: 3
    }
  },
  { paranoid: true }
)

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
  let options = {
    where: {
      roleId: {
        [Op.eq]: 3
      }
    }
  }
  if (!isModel) {
    options = {
      ...options,
      raw: true,
      nest: true
    }
  }
  const data = await User.findByPk(userId, options)
  return data
}

const getValidUserById = async (userId) => {
  const data = await User.findOne({
    where: {
      id: userId,
      roleId: {
        [Op.eq]: 3
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
        [Op.eq]: 3
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
      roleId: 3
    },
    attributes: ['id', 'nick_name', 'description', 'isBanned'],
    include: { model: modelConfig[category].model, as: modelConfig[category].tableName },
    nest: true
  })

  return data
}

const getLastStaff = async () => {
  const data = await User.findAll({
    where: {
      roleId: 2
    },
    attributes: ['full_name'],
    order: [['createdAt', 'DESC']],
    limit: 1,
    nest: true,
    raw: true
  })

  return data
}

const createUser = async (userData) => {
  await User.create(userData)
}

const getUserByEmail = async (email) => {
  const data = await User.findOne({
    where: {
      email
    },
    raw: true,
    nest: true
  })

  return data
}

const getUsers = async (isBanned) => {
  const options = {
    raw: true,
    nest: true
  }
  if (isBanned) {
    options.where = {
      isBanned: 1
    }
  }
  const data = await User.findAll(options)
  return data
}

module.exports = {
  User,
  getUserById,
  getValidUserById,
  getUserWithRelatedData,
  getUsersByCategory,
  getLastStaff,
  createUser,
  getUserByEmail,
  getUsers
}
