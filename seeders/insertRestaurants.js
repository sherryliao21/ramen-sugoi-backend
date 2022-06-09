if (process.env.ENV !== 'production') {
  require('dotenv').config()
}

require('../databases/mariaDB')
const Category = require('../models/category')
const Area = require('../models/area')
const { infoLogger, errorLogger } = require('../utils/logger')
const Restaurant = require('../models/restaurant')

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
    for (let area of areas) {
      await Area.create(area)
    }
    for (let category of categories) {
      await Category.create(category)
    }
    for (let restaurant of restaurants) {
      await Restaurant.create(restaurant)
    }

    infoLogger.info('seeders/insertRestaurants: Successfully added seed restaurants!')
    process.exit()
  } catch (error) {
    errorLogger.error(`seeders/insertRestaurants: ${error.stack}`)
  }
}

insertSeedRestaurants(seedAreas, seedCategories, seedRestaurants)
