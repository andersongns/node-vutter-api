const {
  addToolsUseCase, deleteToolsByIdUseCase, getToolsUseCase, getToolsByTagUseCase
} = require('../../../domain/usecases/tools')

const mongodb = require('../../../infra/db/mongodb')

module.exports = {
  addToolsUseCase: addToolsUseCase(mongodb),
  deleteToolsByIdUseCase: deleteToolsByIdUseCase(mongodb),
  getToolsUseCase: getToolsUseCase(mongodb),
  getToolsByTagUseCase: getToolsByTagUseCase(mongodb)
}
