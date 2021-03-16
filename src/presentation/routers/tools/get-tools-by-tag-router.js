const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')

const getToolsByTagRouter = ({ getToolsByTagUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!getToolsByTagUseCase) throw new MissingDependenceError('getToolsByTagUseCase')
      const { tag } = httpRequest.query
      const tools = await getToolsByTagUseCase.getToolsByTag(tag)
      return httpResponse.ok(tools)
    } catch (error) {
      return httpResponse.serverError(error)
    }
  }
  return {
    route
  }
}

module.exports = getToolsByTagRouter
