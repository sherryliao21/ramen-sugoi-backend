const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Area } = require('./area')
const { Category } = require('./category')
const { User } = require('./user')

const Restaurant = ramenDB.define(
  'restaurant',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING
    },
    profile_pic: {
      type: DataTypes.STRING,
      defaultValue: 'https://imgur.com/Wrdjiye.png'
    },
    description: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING
    },
    categoryId: {
      type: DataTypes.INTEGER
    },
    areaId: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

Area.hasOne(Restaurant)
Restaurant.belongsTo(Area, {
  foreignKey: 'areaId',
  constraints: false
})

Category.hasOne(Restaurant)
Restaurant.belongsTo(Category, {
  foreignKey: 'categoryId',
  constraints: false
})

// query methods
const getRestaurantById = async (restaurantId, options) => {
  let data = []
  if (options) {
    data = await Restaurant.findByPk(restaurantId, {
      nest: true,
      attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
      include: [
        { model: User, as: 'RatingAuthors' },
        { model: User, as: 'CommentAuthors' },
        { model: Category, attributes: ['name'] },
        { model: Area, attributes: ['name'] }
      ]
    })
    return data
  }
  data = await Restaurant.findByPk(restaurantId, {
    raw: true,
    nest: true
  })

  return data
}

const getRestaurantsByCategories = async (categoryId, areaId, isLatest) => {
  const keys = {}
  if (categoryId && categoryId.trim()) keys.categoryId = categoryId
  if (areaId && areaId.trim()) keys.areaId = areaId
  const options = {
    where: keys,
    attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId']
  }
  if (isLatest && isLatest === 'true') {
    options.order = [['createdAt', 'DESC']]
    options.limit = 10
  }
  const data = await Restaurant.findAll(options)
  return data
}

const getRestaurantsByKeyword = async (keyword) => {
  const options = {
    where: {
      name: {
        [Op.substring]: keyword
      }
    },
    nest: true,
    attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
    include: [
      { model: User, as: 'RatingAuthors', attributes: ['id'] },
      { model: User, as: 'CommentAuthors', attributes: ['id'] },
      { model: Category, attributes: ['name'] },
      { model: Area, attributes: ['name'] }
    ]
  }
  const data = await Restaurant.findAll(options)
  return data
}

const getRestaurantsByPopularity = async (category, modelConfig) => {
  const options = {
    attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
    include: { model: modelConfig[category].model, as: modelConfig[category].tableName },
    nest: true
  }
  const data = await Restaurant.findAll(options)
  return data
}

module.exports = {
  Restaurant,
  getRestaurantById,
  getRestaurantsByCategories,
  getRestaurantsByKeyword,
  getRestaurantsByPopularity
}
