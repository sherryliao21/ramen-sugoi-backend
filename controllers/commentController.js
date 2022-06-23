const userHelper = require('../models/user')
const restaurantHelper = require('../models/restaurant')
const commentHelper = require('../models/comment')
const { infoLogger, errorLogger, warningLogger } = require('../utils/logger')

const postComment = async (req, res) => {
  try {
    const userId = req.user.id
    const { content, restaurantId } = req.body
    const user = await userHelper.getUserById(userId)

    if (!user) {
      warningLogger.warn('commentController/postComment: This user does not exist.')
      return res.status(403).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const restaurant = await restaurantHelper.getRestaurantById(restaurantId)
    if (!restaurant) {
      warningLogger.warn('commentController/postComment: This restaurant does not exist.')
      return res.status(404).send({
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
    /*
      From 2nd time on, creating new comments on the same restaurant will fail since there's
      an unique constraint on comments table. Execute following SQL statement MANUALLY to enable full feature.
      `
        ALTER TABLE comments
        DROP CONSTRAINT comments_authorId_restaurantId_unique
      `
    */
    const commentData = await commentHelper.getCommentCountOnLastPost(userId, restaurantId)
    const newComment = {
      content,
      visibility: !user.isBanned,
      authorId: userId,
      restaurantId,
      commentCountOnSamePost: commentData.length ? commentData[0].commentCountOnSamePost + 1 : 1
    }
    await commentHelper.createComment(newComment)
    infoLogger.info(`commentController/postComment: userId: ${userId} commented on restaurantId: ${restaurantId}!`)

    return res.status(201).send({
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
    const user = await userHelper.getUserById(userId)

    if (!user) {
      warningLogger.warn('commentController/editComment: This user does not exist.')
      return res.status(403).send({
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
    const comment = await commentHelper.getCommentById(commentId)
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
    const user = await userHelper.getUserById(userId)

    if (!user) {
      warningLogger.warn('commentController/deleteComment: This user does not exist.')
      return res.status(403).send({
        status: 'error',
        message: 'This user does not exist'
      })
    }
    const comment = await commentHelper.getCommentById(commentId)
    if (!comment) {
      warningLogger.warn('commentController/deleteComment: This comment does not exist.')
      return res.status(404).send({
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
    const comments = await commentHelper.getLatestVisibleComments()

    return res.status(200).send(comments)
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
