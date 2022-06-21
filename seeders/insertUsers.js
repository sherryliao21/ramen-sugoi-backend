if (process.env.ENV !== 'production') {
  require('dotenv').config()
}
const ramenDB = require('../databases/mariaDB')
const { User, Role, Followship } = require('../models/index')
const { infoLogger, errorLogger } = require('../utils/logger')

const roleSeed = [
  {
    id: 1,
    name: 'Admin'
  },
  {
    id: 2,
    name: 'Staff'
  },
  {
    id: 3,
    name: 'User'
  }
]
const userSeed = [
  {
    full_name: 'test_admin',
    nick_name: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$MsEjbMoiEo8ZwFWCB04b7u9P66ZzBe6a6KEBB38R7C0fx3ptw.y2C',
    description: 'admin',
    roleId: 1
  },
  {
    full_name: 'test_user1',
    nick_name: 'user1',
    email: 'user1@example.com',
    password: '$2a$10$3agOAWd9uVw.z7UScL2jCuJtxuJiebyEO2j/Lwu8Ad5nYpm8m0Jrq',
    description: 'user1',
    roleId: 3
  },
  {
    full_name: 'test_user2',
    nick_name: 'user2',
    email: 'user2@example.com',
    password: '$2a$10$fZgndkwfSfRcOdfBZkKWC.eoumU5i7igWOFXbm1hNXaTmLXWqbOnO',
    description: 'user2',
    roleId: 3,
    isBanned: 1
  },
  {
    full_name: 'test_user3',
    nick_name: 'user3',
    email: 'user3@example.com',
    password: '$2a$10$UWXkJ4.Si8LWuySN0c0Thu/VlcITnl6a8qXyNSD40n4p9TcCnM3P.',
    description: 'user3',
    roleId: 3
  },
  {
    full_name: 'test_staff1',
    nick_name: 'staff1',
    email: 'staff1@example.com',
    password: '$2a$10$UWXkJ4.Si8LWuySN0c0Thu/VlcITnl6a8qXyNSD40n4p9TcCnM3P.',
    description: 'staff1',
    roleId: 2
  },
  {
    full_name: 'test_staff2',
    nick_name: 'staff2',
    email: 'staff2@example.com',
    password: '$2a$10$UWXkJ4.Si8LWuySN0c0Thu/VlcITnl6a8qXyNSD40n4p9TcCnM3P.',
    description: 'staff2',
    roleId: 2
  }
]

const followshipSeed = [
  {
    followingId: 2,
    followerId: 4
  },
  {
    followingId: 4,
    followerId: 2
  }
]

const insertSeedUsers = async (roles, users, followships) => {
  try {
    await ramenDB.transaction(async (t) => {
      await Role.bulkCreate(roles, {
        transaction: t
      })
      await User.bulkCreate(users, {
        transaction: t
      })
      await Followship.bulkCreate(followships, {
        transaction: t
      })
    })

    infoLogger.info('seeders/insertUsers: Successfully added seed users!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertUsers: ${error.stack}`)
  }
}

insertSeedUsers(roleSeed, userSeed, followshipSeed)
