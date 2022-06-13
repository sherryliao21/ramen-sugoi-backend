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
      password: '$2a$10$MsEjbMoiEo8ZwFWCB04b7u9P66ZzBe6a6KEBB38R7C0fx3ptw.y2C',
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
      password: '$2a$10$3agOAWd9uVw.z7UScL2jCuJtxuJiebyEO2j/Lwu8Ad5nYpm8m0Jrq',
      description: 'user1',
      roleId: 2
    }
  }
]

const insertSeedUsers = async (seeds) => {
  try {
    await ramenDB.transaction(async (t) => {
      await Role.bulkCreate(seeds, {
        include: [User],
        transaction: t
      })
    })

    infoLogger.info('seeders/insertUsers: Successfully added seed users!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertUsers: ${error.stack}`)
  }
}

insertSeedUsers(seedData)
