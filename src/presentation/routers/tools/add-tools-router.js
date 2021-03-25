const { HttpResponse } = require('../../helpers')
const { MissingDependenceError, DependenceNotFoundError } = require('../../../utils/errors')

module.exports = class GetToolsByTagRouter {
  constructor ({ addToolsUseCase }) {
    if (!addToolsUseCase) throw new DependenceNotFoundError()
    if (!Object.keys(addToolsUseCase).length) throw new MissingDependenceError('addToolsUseCase')
    this.addToolsUseCase = addToolsUseCase
  }

  async route (httpRequest) {
    try {
      const tool = await this.addToolsUseCase.add(httpRequest.body)
      return HttpResponse.created(tool)
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
