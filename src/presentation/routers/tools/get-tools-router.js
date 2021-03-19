const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError, DependenceNotFoundError } } = require('../../../../src/utils')

const getToolsRouter = ({ getToolsByTagUseCase, getToolsUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!getToolsUseCase || !getToolsByTagUseCase) throw new DependenceNotFoundError()
      if (!Object.keys(getToolsUseCase).length) throw new MissingDependenceError('getToolsUseCase')
      if (!Object.keys(getToolsByTagUseCase).length) throw new MissingDependenceError('getToolsByTagUseCase')
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
