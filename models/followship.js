const { DataTypes } = require('sequelize')
const { ramenDB } = require('../databases/mariaDB')

const Followship = ramenDB.define('followship', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  followerId: {
    type: DataTypes.INTEGER
  },
  followingId: {
    type: DataTypes.INTEGER
  }
})

const getFollowship = async (followerId, followingId) => {
  const data = await Followship.findOne({
    where: {
      followingId,
      followerId
    }
  })
  return data
}

const createFollowship = async (followerId, followingId) => {
  await Followship.create({
    followerId,
    followingId
  })
}

module.exports = {
  Followship,
  getFollowship,
  createFollowship
}
