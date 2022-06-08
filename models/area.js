const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

const Area = ramenDB.define(
  'area',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING
    }
  },
  { paranoid: true }
)

module.exports = Area