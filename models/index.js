const ramenDB = require('../databases/mariaDB')
const { infoLogger, errorLogger } = require('../utils/logger')
const Area = require('./area')
const Category = require('./category')
const Comment = require('./comment')
const Favorite = require('./favorite')
const Followship = require('./followship')
const Rating = require('./rating')
const Restaurant = require('./restaurant')
const Role = require('./role')
const User = require('./user')

ramenDB
  // Enable this to re-sync DB. CAUTIOUS: will drop all existing DBs
  // .sync({ force: true })
  .sync()
  .then(() => {
    infoLogger.info('[MariaDB] DB synced')
  })
  .catch((err) => {
    errorLogger.error(`models/index: DB sync failed: ${err.stack}`)
  })

module.exports = {
  Area,
  Category,
  Comment,
  Favorite,
  Followship,
  Rating,
  Restaurant,
  Role,
  User
}
