const { User } = require('../index')

const getUserById = async (userId) => {
  const data = await User.findByPk(userId, {
    raw: true,
    nest: true
  })
  return data
}

module.exports = {
  getUserById
}
