const { errors: { MissingDependenceError } } = require('../../../utils')
const getToolsUseCase = ({ getToolsRepository }) => {
  const getTools = async () => {
    if (!getToolsRepository) throw new MissingDependenceError('getToolsRepository')
    const tools = await getToolsRepository.get()
    return tools
  }

  return {
    getTools
  }
}

module.exports = getToolsUseCase
