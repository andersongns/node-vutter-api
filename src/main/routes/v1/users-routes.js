const { addUserRouter } = require('../../factories/presentation/users-presentation-factory')
const ExpressRouterAdapter = require('../../adapters/express-router-adapter')

module.exports = (router) => {
  router.post('/users', ExpressRouterAdapter.adapt(addUserRouter))
}
