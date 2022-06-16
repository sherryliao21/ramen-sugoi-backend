const { User, Restaurant, Comment } = require('../models/index')
const { infoLogger, errorLogger, warningLogger } = require('../utils/logger')

const postComment = async (req, res) => {
  try {
    const userId = req.user.id
    const { content, restaurantId } = req.body
    const user = await User.findByPk(userId)
    if (!user) {
      warningLogger.warn('commentController/postComment: This user does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const restaurant = await Restaurant.findByPk(restaurantId)
    if (!restaurant) {
      warningLogger.warn('commentController/postComment: This restaurant does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This restaurant does not exist'
      })
    }
    if (!content.trim()) {
      warningLogger.warn('commentController/postComment: Comment cannot be empty!')
      return res.status(400).send({
        status: 'error',
        message: 'Comment cannot be empty!'
      })
    }
    await Comment.create({
      content,
      visibility: !user.isBanned,
      authorId: userId,
      restaurantId: restaurantId
    })
    infoLogger.info(`commentController/postComment: userId: ${userId} commented on restaurantId: ${restaurantId}!`)
    return res.status(200).send({
      status: 'success',
      message: 'Successfully posted a comment!'
    })
  } catch (error) {
    errorLogger.error(`commentController/postComment: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to post comment'
    })
  }
}
const editComment = async (req, res) => {
  try {
    const userId = req.user.id
    const { commentId } = req.params
    const { content } = req.body
    const user = await User.findByPk(userId)
    if (!user) {
      warningLogger.warn('commentController/editComment: This user does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    if (!content.trim()) {
      warningLogger.warn('commentController/editComment: Comment cannot be empty!')
      return res.status(400).send({
        status: 'error',
        message: 'Comment cannot be empty!'
      })
    }
    const comment = await Comment.findByPk(commentId)
    comment.content = content
    await comment.save()
    infoLogger.info(`commentController/editComment: userId: ${userId} updated comment on restaurantId: ${comment.restaurantId}!`)
    return res.status(200).send({
      status: 'success',
      message: 'Successfully updated a comment!'
    })
  } catch (error) {
    errorLogger.error(`commentController/editComment: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to update comment'
    })
  }
}

const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id
    const { commentId } = req.params
    const user = await User.findByPk(userId)
    if (!user) {
      warningLogger.warn('commentController/deleteComment: This user does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const comment = await Comment.findByPk(commentId)
    if (!comment) {
      warningLogger.warn('commentController/deleteComment: This comment does not exist.')
      return res.status(400).send({
        status: 'error',
        message: 'This comment does not exist'
      })
    }
    await comment.destroy()
    infoLogger.info(`commentController/deleteComment: userId: ${userId} deleted comment on restaurantId: ${comment.restaurantId}!`)
    return res.status(200).send({
      status: 'success',
      message: 'Successfully deleted a comment!'
    })
  } catch (error) {
    errorLogger.error(`commentController/deleteComment: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to delete comment'
    })
  }
}

const getLatestComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      attributes: ['id', 'authorId', 'restaurantId', 'content', 'visibility', 'createdAt']
    })
    return res.status(200).send({
      status: 'success',
      message: 'Retrieved a list of latest comments',
      comments
    })
  } catch (error) {
    errorLogger.error(`commentController/getLatestComments: ${error.stack}`)
    return res.status(500).send({
      status: 'error',
      message: 'Unable to get latest comments'
    })
  }
}

module.exports = {
  postComment,
  editComment,
  deleteComment,
  getLatestComments
}
