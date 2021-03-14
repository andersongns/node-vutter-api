const { errors: { MissingParamError, MissingDependenceError } } = require('../../../utils')
const getToolsByTagUseCase = ({ toolsRepository }) => {
  const getToolsByTag = async (tag) => {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    if (!tag) throw new MissingParamError('tag')
    const tools = await toolsRepository.getByTag(tag)
    return tools
  }

  return {
    getToolsByTag
  }
}

module.exports = getToolsByTagUseCase
