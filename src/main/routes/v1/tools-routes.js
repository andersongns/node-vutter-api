
const { addToolsRouter, deleteToolsByIdRouter, getToolsRouter } = require('../../factories/presentation/tools-presentation-factory')
const ExpressRouterAdapter = require('../../adapters/express-router-adapter')

module.exports = (router) => {
  router.get('/tools', ExpressRouterAdapter.adapt(getToolsRouter))
  router.post('/tools', ExpressRouterAdapter.adapt(addToolsRouter))
  router.delete('/tools/:id', ExpressRouterAdapter.adapt(deleteToolsByIdRouter))
}
