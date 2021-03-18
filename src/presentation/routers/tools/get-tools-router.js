const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')

const getToolsRouter = ({ getToolsByTagUseCase, getToolsUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!getToolsUseCase) throw new MissingDependenceError('getToolsUseCase')
      if (!getToolsByTagUseCase) throw new MissingDependenceError('getToolsByTagUseCase')
      const { tag } = httpRequest.query
      let tools = []
      if (tag) {
        tools = await getToolsByTagUseCase.getToolsByTag(tag)
      } else {
        tools = await getToolsUseCase.getTools()
      }
      return httpResponse.ok(tools)
    } catch (error) {
      return httpResponse.serverError(error)
    }
  }
  return {
    route
  }
}

module.exports = getToolsRouter
