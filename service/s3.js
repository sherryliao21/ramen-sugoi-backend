if (process.env.ENV !== 'production') {
  require('dotenv').config()
}
const {
  S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand
} = require('@aws-sdk/client-s3')
const fs = require('fs')
const { errorLogger, infoLogger } = require('../utils/logger')

const REGION = process.env.S3_REGION
const s3Client = new S3Client({ region: REGION })

// convert data stream to buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const data = []
    stream.on('data', (chunk) => {
      data.push(chunk)
    })
    stream.on('end', () => {
      resolve(Buffer.concat(data))
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })

const uploadAvatar = async (file, userId) => {
  try {
    const stream = fs.createReadStream(file.path)

    const params = {
      Bucket: process.env.S3_BUCKET_HOST,
      Key: `avatar/user${userId.toString()}_avatar`,
      Body: stream,
      ACL: 'public-read'
    }
    const results = await s3Client.send(new PutObjectCommand(params))
    infoLogger.info(`Successfully created ${params.Key} and uploaded it to ${params.Bucket}/${params.Key}`)

    return results
  } catch (error) {
    errorLogger.error(`service/s3/uploadAvatar: ${error.stack}`)
  }
}

const getAvatar = async (userId) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_HOST,
      Key: `avatar/user${userId.toString()}_avatar`
    }
    const data = await s3Client.send(new GetObjectCommand(params))
    const content = await streamToBuffer(data.Body)

    return content
  } catch (error) {
    errorLogger.error(`service/s3/getAvatar: ${error.stack}`)
  }
}

const deleteAvatar = async (userId) => {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_HOST,
      Key: `avatar/user${userId.toString()}_avatar`
    }
    const data = await s3Client.send(new DeleteObjectCommand(params))

    return data
  } catch (error) {
    errorLogger.error(`service/s3/getAvatar: ${error.stack}`)
  }
}

const uploadRestaurantPic = async (file, restaurantId) => {
  try {
    const stream = fs.createReadStream(file.path)

    const params = {
      Bucket: process.env.S3_BUCKET_HOST,
      Key: `restaurant/restaurant${restaurantId.toString()}_profile`,
      Body: stream,
      ACL: 'public-read'
    }
    const results = await s3Client.send(new PutObjectCommand(params))
    infoLogger.info(`Successfully created ${params.Key} and uploaded it to ${params.Bucket}/${params.Key}`)

    return results
  } catch (error) {
    errorLogger.error(`service/s3/uploadAvatar: ${error.stack}`)
  }
}

module.exports = {
  uploadAvatar,
  getAvatar,
  deleteAvatar,
  uploadRestaurantPic
}
