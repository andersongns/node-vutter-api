const { MissingDependenceError } = require('../../utils/errors')
module.exports = class GetToolsUseCase {
  constructor ({ toolsRepository }) {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    this.toolsRepository = toolsRepository
  }

  async getTools () {
    if (!this.toolsRepository) throw new MissingDependenceError('toolsRepository')
    const tools = await this.toolsRepository.get()
    return tools
  }
}
