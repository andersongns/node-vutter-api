
const { addToolsRouter, deleteToolsByIdRouter, getToolsRouter } = require('../../factories/presentation/tools-presentation-factory')
const { ExpressJsonRouterAdapter } = require('../../adapters/express-router-adapter')

module.exports = (router) => {
  router.get('/tools', ExpressJsonRouterAdapter.adapt(getToolsRouter))
  router.post('/tools', ExpressJsonRouterAdapter.adapt(addToolsRouter))
  router.delete('/tools/:id', ExpressJsonRouterAdapter.adapt(deleteToolsByIdRouter))
}
