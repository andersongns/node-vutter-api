const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError, DependenceNotFoundError } } = require('../../../../src/utils')

const getToolsByTagRouter = ({ deleteToolsByIdUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!deleteToolsByIdUseCase) throw new DependenceNotFoundError()
      if (!Object.keys(deleteToolsByIdUseCase).length) throw new MissingDependenceError('deleteToolsByIdUseCase')
      const { id } = httpRequest.params
      const isDeleted = await deleteToolsByIdUseCase.deleteById(id)
      if (isDeleted) return httpResponse.noContent()
      return httpResponse.notFound({ message: `${id} not found` })
    } catch (error) {
      return httpResponse.serverError(error)
    }
  }
  return {
    route
  }
}

module.exports = getToolsByTagRouter
