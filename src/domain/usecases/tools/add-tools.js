const { errors: { MissingParamError, MissingDependenceError } } = require('../../../utils')
const addToolsUseCase = ({ toolsRepository }) => {
  const add = async (tool) => {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    const { title } = tool
    if (!title) throw new MissingParamError('title')
    const tools = await toolsRepository.add(tool)
    return tools
  }

  return {
    add
  }
}

module.exports = addToolsUseCase
