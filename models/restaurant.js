const { DataTypes, Op } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Area } = require('./area')
const { Category } = require('./category')
const { User } = require('./user')
const { Status, getStatusByName } = require('./status')

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
    },
    statusId: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  { paranoid: true }
)

Status.hasOne(Restaurant)
Restaurant.belongsTo(Status, {
  foreignKey: 'statusId',
  constraints: false
})

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
const getRestaurantById = async (restaurantId, includeRelatedTables) => {
  let data = []
  let options = {
    where: {
      id: restaurantId,
      statusId: 3
    },
    raw: true,
    nest: true
  }
  if (includeRelatedTables) {
    options = {
      where: {
        id: restaurantId,
        statusId: 3
      },
      nest: true,
      attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
      include: [
        { model: User, as: 'RatingAuthors' },
        { model: User, as: 'CommentAuthors' },
        { model: Category, attributes: ['name'] },
        { model: Area, attributes: ['name'] }
      ]
    }
  }
  data = await Restaurant.findOne(options)

  return data
}

const getRestaurantsByCategories = async (categoryId, areaId, isLatest) => {
  const keys = {
    statusId: 3
  }
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

const getRestaurantByKeyword = async (keyword) => {
  const options = {
    where: {
      name: {
        [Op.substring]: keyword
      },
      statusId: 3
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
    where: {
      statusId: 3
    },
    attributes: ['id', 'name', 'profile_pic', 'description', 'address', 'categoryId', 'areaId'],
    include: { model: modelConfig[category].model, as: modelConfig[category].tableName },
    nest: true
  }
  const data = await Restaurant.findAll(options)
  return data
}

const getRestaurantByStatus = async (status) => {
  let whereOption = {}
  if (status !== 'All') {
    const data = await getStatusByName(status)
    whereOption = {
      statusId: data.id
    }
  }
  const data = await Restaurant.findAll({
    where: whereOption,
    attributes: ['id', 'name', 'profile_pic'],
    raw: true,
    nest: true
  })
  return data
}

const createRestaurant = async (content) => {
  await Restaurant.create(content)
}

const getRestaurantByIdInBackstage = async (restaurantId) => {
  const data = await Restaurant.findByPk(restaurantId)
  return data
}

module.exports = {
  Restaurant,
  getRestaurantById,
  getRestaurantsByCategories,
  getRestaurantByKeyword,
  getRestaurantsByPopularity,
  getRestaurantByStatus,
  createRestaurant,
  getRestaurantByIdInBackstage
}
