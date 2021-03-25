const { MissingDependenceError } = require('../../utils/errors')
module.exports = class GetToolsUseCase {
  constructor ({ toolsRepository }) {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    this.toolsRepository = toolsRepository
  }

  async getTools () {
    const tools = await this.toolsRepository.get()
    return tools
  }
}
