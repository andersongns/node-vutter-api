const { AddToolsRouter, DeleteToolsByIdRouter, GetToolsRouter } = require('../../../presentation/routers/tools')
const usecases = require('../usecases/tools-usecase-factory')

module.exports = {
  addToolsRouter: new AddToolsRouter(usecases),
  deleteToolsByIdRouter: new DeleteToolsByIdRouter(usecases),
  getToolsRouter: new GetToolsRouter(usecases)
}
