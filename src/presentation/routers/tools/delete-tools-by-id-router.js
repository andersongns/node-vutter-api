const { HttpResponse } = require('../../helpers')
const { MissingDependenceError, DependenceNotFoundError } = require('../../../utils/errors')

module.exports = class GetToolsByTagRouter {
  constructor ({ deleteToolsByIdUseCase }) {
    if (!deleteToolsByIdUseCase) throw new DependenceNotFoundError()
    if (!Object.keys(deleteToolsByIdUseCase).length) throw new MissingDependenceError('deleteToolsByIdUseCase')
    this.deleteToolsByIdUseCase = deleteToolsByIdUseCase
  }

  async route (httpRequest) {
    try {
      const { id } = httpRequest.params
      const isDeleted = await this.deleteToolsByIdUseCase.deleteById(id)
      if (isDeleted) return HttpResponse.noContent()
      return HttpResponse.notFound({ message: `${id} not found` })
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
