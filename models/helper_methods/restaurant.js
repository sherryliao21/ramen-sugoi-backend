const { Restaurant } = require('../index')

const getRestaurantById = async (restaurantId) => {
  const data = await Restaurant.findByPk(restaurantId, {
    raw: true,
    nest: true
  })
  return data
}

module.exports = {
  getRestaurantById
}
