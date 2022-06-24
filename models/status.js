const { DataTypes } = require('sequelize')
const { ramenDB } = require('../databases/mariaDB')

const Status = ramenDB.define('status', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  }
})

// query methods
const getStatusByName = async (name) => {
  const data = await Status.findOne({
    where: {
      name
    },
    attributes: ['id'],
    raw: true,
    nest: true
  })

  return data
}

module.exports = {
  Status,
  getStatusByName
}
