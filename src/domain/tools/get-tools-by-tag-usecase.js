const { MissingParamError, MissingDependenceError } = require('../../utils/errors')

module.exports = class GetToolsByTagUseCase {
  constructor ({ toolsRepository }) {
    if (!toolsRepository) throw new MissingDependenceError('toolsRepository')
    this.toolsRepository = toolsRepository
  }

  async getToolsByTag (tag) {
    if (!tag) throw new MissingParamError('tag')
    const tools = await this.toolsRepository.getByTag(tag)
    return tools
  }
}
