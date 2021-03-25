const { MissingParamError, MissingDependenceError } = require('../../utils/errors')
module.exports = class DeleteToolsByIdUseCase {
  constructor ({ toolsRepository }) {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    this.toolsRepository = toolsRepository
  }

  async deleteById (id) {
    if (!id) throw new MissingParamError('id')
    const tools = await this.toolsRepository.deleteById(id)
    return tools
  }
}
