const {
  AddToolsUseCase, DeleteToolsByIdUseCase, GetToolsUseCase, GetToolsByTagUseCase
} = require('../../../domain/tools')

const { ToolsRepository } = require('../../../infra/db/mongodb')

const dependencies = {
  toolsRepository: ToolsRepository
}

module.exports = {
  addToolsUseCase: new AddToolsUseCase(dependencies),
  deleteToolsByIdUseCase: new DeleteToolsByIdUseCase(dependencies),
  getToolsUseCase: new GetToolsUseCase(dependencies),
  getToolsByTagUseCase: new GetToolsByTagUseCase(dependencies)
}
