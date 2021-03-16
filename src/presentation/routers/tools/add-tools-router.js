const { httpResponse } = require('../../helpers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')

const getToolsByTagRouter = ({ addToolsUseCase }) => {
  const route = async (httpRequest) => {
    try {
      if (!addToolsUseCase) throw new MissingDependenceError('addToolsUseCase')
      const tool = await addToolsUseCase.add(httpRequest.body)
      return httpResponse.created(tool)
    } catch (error) {
      return httpResponse.serverError(error)
    }
  }
  return {
    route
  }
}

module.exports = getToolsByTagRouter
