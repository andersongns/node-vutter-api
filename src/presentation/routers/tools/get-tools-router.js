const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')

const getToolsRouter = ({ getToolsUseCase }) => {
  const route = async () => {
    try {
      if (!getToolsUseCase) throw new MissingDependenceError('getToolsUseCase')
      const tools = await getToolsUseCase.getTools()
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
