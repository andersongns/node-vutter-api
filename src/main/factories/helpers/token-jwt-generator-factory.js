const { TokenJwtGenerator } = require('../../../utils/helpers')

module.exports = new TokenJwtGenerator(process.env.JWT_SECRET)
