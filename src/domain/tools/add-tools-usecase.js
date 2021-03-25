const { MissingParamError, MissingDependenceError } = require('../../utils/errors')
module.exports = class AddToolsUseCase {
  constructor ({ toolsRepository }) {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    this.toolsRepository = toolsRepository
  }

  async add (tool) {
    const { title } = tool
    if (!title) throw new MissingParamError('title')
    const tools = await this.toolsRepository.add(tool)
    return tools
  }
}
