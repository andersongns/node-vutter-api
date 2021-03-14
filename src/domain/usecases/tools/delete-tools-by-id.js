const { errors: { MissingParamError, MissingDependenceError } } = require('../../../utils')
const deleteToolsByIdUseCase = ({ toolsRepository }) => {
  const deleteById = async (id) => {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    if (!id) throw new MissingParamError('id')
    const tools = await toolsRepository.deleteById(id)
    return tools
  }

  return {
    deleteById
  }
}

module.exports = deleteToolsByIdUseCase
