if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

const ramenDB = require('../databases/mariaDB')
const Category = require('../models/category')
const Area = require('../models/area')
const Restaurant = require('../models/restaurant')
const { infoLogger, errorLogger } = require('../utils/logger')

const seedCategories = [
  { id: 1, name: '雞白湯' },
  { id: 2, name: '醬油' },
  { id: 3, name: '辣味' }
]

const seedAreas = [
  { id: 1, name: '台北市' },
  { id: 2, name: '台中市' }
]

const seedRestaurants = [
  {
    name: '一蘭',
    description: '一蘭拉麵',
    categoryId: 2,
    areaId: 1
  },
  {
    name: '一樂',
    description: '一樂拉麵',
    categoryId: 2,
    areaId: 1
  },
  {
    name: '丸',
    description: '丸拉麵',
    categoryId: 1,
    areaId: 2
  }
]

const insertSeedRestaurants = async (areas, categories, restaurants) => {
  try {
    await ramenDB.transaction(async (t) => {
      for (let area of areas) {
        await Area.create(area, { transaction: t })
      }
      for (let category of categories) {
        await Category.create(category, { transaction: t })
      }
      for (let restaurant of restaurants) {
        await Restaurant.create(restaurant, { transaction: t })
      }
    })

    infoLogger.info('seeders/insertRestaurants: Successfully added seed restaurants!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertRestaurants: ${error.stack}`)
  }
}

insertSeedRestaurants(seedAreas, seedCategories, seedRestaurants)
