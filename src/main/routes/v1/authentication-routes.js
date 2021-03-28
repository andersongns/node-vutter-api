
const { authenticationRouter } = require('../../factories/presentation/authentication-presentation-factory')
const ExpressRouterAdapter = require('../../adapters/express-router-adapter')

module.exports = (router) => {
  router.post('/auth', ExpressRouterAdapter.adapt(authenticationRouter))
}
