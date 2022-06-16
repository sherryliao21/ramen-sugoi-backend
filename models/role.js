const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

const Role = ramenDB.define(
  'role',
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

module.exports = {
  Role
}
