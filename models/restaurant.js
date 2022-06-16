const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')
const { Area } = require('./area')
const { Category } = require('./category')

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

module.exports = {
  Restaurant
}
