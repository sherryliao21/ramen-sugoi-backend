if (process.env.ENV !== 'production') {
  require('dotenv').config()
}
const ramenDB = require('../databases/mariaDB')
const Role = require('../models/role')
const User = require('../models/user')
const { infoLogger, errorLogger } = require('../utils/logger')

const seedData = [
  {
    id: 1,
    name: 'Admin',
    user: {
      full_name: 'test_admin',
      nick_name: 'admin',
      email: 'admin@example.com',
      password: 'admin',
      description: 'admin',
      roleId: 1
    }
  },
  {
    id: 2,
    name: 'User',
    user: {
      full_name: 'test_user1',
      nick_name: 'user1',
      email: 'user1@example.com',
      password: 'user1',
      description: 'user1',
      roleId: 2
    }
  },
  {
    id: 3,
    name: 'Banned',
    user: {
      full_name: 'test_user2',
      nick_name: 'user2',
      email: 'user2@example.com',
      password: 'user2',
      description: 'user2',
      roleId: 3
    }
  }
]

const insertSeedUsers = async (seeds) => {
  try {
    await ramenDB.transaction(async (t) => {
      for (let seed of seeds) {
        await Role.create(seed, {
          include: [User],
          transaction: t
        })
      }
    })

    infoLogger.info('seeders/insertUsers: Successfully added seed users!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertUsers: ${error.stack}`)
  }
}

insertSeedUsers(seedData)
