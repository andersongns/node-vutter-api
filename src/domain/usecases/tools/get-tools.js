const { errors: { MissingDependenceError } } = require('../../../utils')
const getToolsUseCase = ({ toolsRepository }) => {
  const getTools = async () => {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    const tools = await toolsRepository.get()
    return tools
  }

  return {
    getTools
  }
}

module.exports = getToolsUseCase
