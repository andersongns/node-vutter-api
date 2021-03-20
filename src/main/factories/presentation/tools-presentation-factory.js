const { addToolsRouter, deleteToolsByIdRouter, getToolsRouter } = require('../../../presentation/routers/tools')
const usecases = require('../usecases/tools-usecase-factory')

module.exports = {
  addToolsRouter: addToolsRouter(usecases),
  deleteToolsByIdRouter: deleteToolsByIdRouter(usecases),
  getToolsRouter: getToolsRouter(usecases)
}
