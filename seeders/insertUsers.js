if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

require('../databases/mariaDB')
const Role = require('../models/role')
const User = require('../models/user')
const { infoLogger, errorLogger } = require('../utils/logger')

const seedRoles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'User' },
  { id: 3, name: 'Banned' }
]

const seedUsers = [
  {
    full_name: 'test_admin',
    nick_name: 'admin',
    email: 'admin@example.com',
    password: 'admin',
    description: 'admin',
    roleId: 1
  },
  {
    full_name: 'test_user1',
    nick_name: 'user1',
    email: 'user1@example.com',
    password: 'user1',
    description: 'user1',
    roleId: 2
  },
  {
    full_name: 'test_user2',
    nick_name: 'user2',
    email: 'user2@example.com',
    password: 'user2',
    description: 'user2',
    roleId: 3
  }
]

const insertSeedUsers = async (roles, users) => {
  try {
    for (let role of roles) {
      await Role.create(role)
    }
    for (let user of users) {
      await User.create(user)
    }

    infoLogger.info('seeders/insertUsers: Successfully added seed users!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertUsers: ${error.stack}`)
  }
}

insertSeedUsers(seedRoles, seedUsers)

// process.exit()
