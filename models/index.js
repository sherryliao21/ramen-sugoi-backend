const ramenDB = require('../databases/mariaDB')
const { infoLogger, errorLogger } = require('../utils/logger')
const { Area } = require('./area')
const { Category } = require('./category')
const { Restaurant } = require('./restaurant')
const { Role } = require('./role')
const { User } = require('./user')
const { Followship } = require('./followship')
const { Comment } = require('./comment')
const { Favorite } = require('./favorite')
const { Rating } = require('./rating')

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

// define relations
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

Role.hasOne(User)
User.belongsTo(Role, {
  foreignKey: 'roleId',
  constraints: false
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followings',
  foreignKey: 'followingId',
  constraints: false
})

User.belongsToMany(User, {
  through: Followship,
  as: 'Followers',
  foreignKey: 'followerId',
  constraints: false
})

Comment.belongsTo(Restaurant, {
  constraints: false
})
Comment.belongsTo(User, {
  constraints: false
})

Restaurant.belongsToMany(User, {
  through: Comment,
  as: 'CommentAuthors',
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Comment,
  as: 'CommentedRestaurants',
  foreignKey: 'authorId',
  constraints: false
})

Restaurant.belongsToMany(User, {
  through: Favorite,
  as: 'LikedUsers',
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Favorite,
  as: 'LikedRestaurants',
  foreignKey: 'userId',
  constraints: false
})

Restaurant.belongsToMany(User, {
  through: Rating,
  as: 'RatingAuthors',
  foreignKey: 'restaurantId',
  constraints: false
})

User.belongsToMany(Restaurant, {
  through: Rating,
  as: 'RatedRestaurants',
  foreignKey: 'authorId',
  constraints: false
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
