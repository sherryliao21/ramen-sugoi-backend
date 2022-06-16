if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

const ramenDB = require('../databases/mariaDB')
const { Restaurant, Area, Category } = require('../models/index')
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
    address: '台北市羅斯福路 123 號',
    categoryId: 2,
    areaId: 1
  },
  {
    name: '一樂',
    description: '一樂拉麵',
    address: '台北市長安東路 277 號',
    categoryId: 2,
    areaId: 1
  },
  {
    name: '丸',
    description: '丸拉麵',
    address: '台中市台灣大道 25 號',
    categoryId: 1,
    areaId: 2
  }
]

const insertSeedRestaurants = async (areas, categories, restaurants) => {
  try {
    await ramenDB.transaction(async (t) => {
      await Area.bulkCreate(areas, { transaction: t })
      await Category.bulkCreate(categories, { transaction: t })
      await Restaurant.bulkCreate(restaurants, { transaction: t })
    })

    infoLogger.info('seeders/insertRestaurants: Successfully added seed restaurants!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertRestaurants: ${error.stack}`)
  }
}

insertSeedRestaurants(seedAreas, seedCategories, seedRestaurants)
