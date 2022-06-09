const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

const Followship = ramenDB.define(
  'followship',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    followerId: {
      type: DataTypes.INTEGER
    },
    followingId: {
      type: DataTypes.INTEGER
    }
  },
  { paranoid: true }
)

module.exports = Followship