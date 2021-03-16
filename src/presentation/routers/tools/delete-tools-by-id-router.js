const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')

const getToolsByTagRouter = ({ deleteToolsByIdUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!deleteToolsByIdUseCase) throw new MissingDependenceError('deleteToolsByIdUseCase')
      const { id } = httpRequest.params
      const isDeleted = await deleteToolsByIdUseCase.deleteById(id)
      if (isDeleted) return httpResponse.noContent()
      return httpResponse.notFound()
    } catch (error) {
      return httpResponse.serverError(error)
    }
  }
  return {
    route
  }
}

module.exports = getToolsByTagRouter
