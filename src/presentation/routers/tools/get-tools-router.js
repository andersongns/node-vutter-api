const { HttpResponse } = require('../../helpers')
const { MissingDependenceError, DependenceNotFoundError } = require('../../../utils/errors')

module.exports = class GetToolsRouter {
  constructor ({ getToolsByTagUseCase, getToolsUseCase }) {
    if (!getToolsUseCase || !getToolsByTagUseCase) throw new DependenceNotFoundError()
    if (!Object.keys(getToolsUseCase).length) throw new MissingDependenceError('getToolsUseCase')
    if (!Object.keys(getToolsByTagUseCase).length) throw new MissingDependenceError('getToolsByTagUseCase')
    this.getToolsByTagUseCase = getToolsByTagUseCase
    this.getToolsUseCase = getToolsUseCase
  }

  async route (httpRequest) {
    try {
      const { tag } = httpRequest.query
      let tools = []
      if (tag) {
        tools = await this.getToolsByTagUseCase.getToolsByTag(tag)
      } else {
        tools = await this.getToolsUseCase.getTools()
      }
      return HttpResponse.ok(tools)
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
