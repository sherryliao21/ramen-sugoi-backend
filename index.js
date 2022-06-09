const { infoLogger } = require('./utils/logger')
const express = require('express')
const app = express()
if (process.env.ENV !== 'production') {
  require('dotenv').config()
}
const PORT = process.env.PORT || 3000

require('./models/index')
const routes = require('./routes/index')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(PORT, () => {
  infoLogger.info(`Express app is now running on port ${PORT}...`)
})
