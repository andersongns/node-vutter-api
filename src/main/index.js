require('dotenv').config({ debug: process.env.DEBUG })
const { mongoHelper } = require('../infra/db/mongodb/helpers')
const app = require('./config/app')

mongoHelper.connect(process.env.MONGO_URL).then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.info('server listening')
  })
})
