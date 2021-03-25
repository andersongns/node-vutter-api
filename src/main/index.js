require('dotenv').config({ debug: process.env.DEBUG })
const { MongoHelper } = require('../infra/db/mongodb/helpers')
const app = require('./config/app')

MongoHelper.connect(process.env.MONGO_URL).then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.info('server listening')
  })
})
