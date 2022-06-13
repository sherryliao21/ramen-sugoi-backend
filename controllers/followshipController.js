const User = require('../models/user')
const Followship = require('../models/followship')
const { infoLogger, errorLogger, warningLogger } = require('../utils/logger')

const followUser = async (req, res) => {
  try {
    const { user } = req
    const followingUserId = req.params.userId
    if (user.id.toString() === followingUserId.toString()) {
      warningLogger.warn('followshipController/followUser: You cannot follow yourself.')
      return res.status(400).send({
        status: 'error',
        message: 'You cannot follow yourself.'
      })
    }
    const followingUser = await User.findByPk(followingUserId)
    if (!followingUser || followingUser.roleId === 1 || followingUser.isBanned === 1) {
      warningLogger.warn('followshipController/followUser: This user does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const followship = await Followship.findOne({
      where: {
        followingId: followingUserId,
        followerId: user.id
      }
    })
    if (followship) {
      warningLogger.warn('followshipController/followUser: You already followed this user.')
      return res.status(400).send({
        status: 'error',
        message: 'You already followed this user'
      })
    }
    await Followship.create({
      followingId: followingUserId,
      followerId: user.id
    })
    infoLogger.info(`followshipController/followUser: Followed userId: ${followingUserId} successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Followed userId: ${followingUserId} successfully!`
    })
  } catch (error) {
    errorLogger.error(`followshipController/followUser: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to follow user'
    })
  }
}

const unfollowUser = async (req, res) => {
  try {
    const { user } = req
    const followingUserId = req.params.userId
    if (user.id.toString() === followingUserId.toString()) {
      warningLogger.warn('followshipController/unfollowUser: You cannot unfollow yourself.')
      return res.status(400).send({
        status: 'error',
        message: 'You cannot unfollow yourself.'
      })
    }
    const followingUser = await User.findByPk(followingUserId)
    if (!followingUser || followingUser.roleId === 1 || followingUser.isBanned === 1) {
      warningLogger.warn('followshipController/unfollowUser: This user does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const followship = await Followship.findOne({
      where: {
        followingId: followingUserId,
        followerId: user.id
      }
    })
    if (!followship) {
      warningLogger.warn('followshipController/followUser: You never followed this user.')
      return res.status(400).send({
        status: 'error',
        message: 'You never followed this user'
      })
    }
    await followship.destroy()
    infoLogger.info(`followshipController/followUser: Unfollowed userId: ${followingUserId} successfully!`)
    return res.status(200).send({
      status: 'success',
      message: `Unfollowed userId: ${followingUserId} successfully!`
    })
  } catch (error) {
    errorLogger.error(`followshipController/unfollowUser: ${error}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to unfollow user'
    })
  }
}

module.exports = {
  followUser,
  unfollowUser
}
