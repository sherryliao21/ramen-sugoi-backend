const { DataTypes } = require('sequelize')
const ramenDB = require('../databases/mariaDB')

const Role = ramenDB.define('role', {
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
const getRoleById = async (roleId) => {
  const data = await Role.findByPk(roleId, {
    raw: true,
    nest: true
  })
  return data
}

module.exports = {
  Role,
  getRoleById
}
