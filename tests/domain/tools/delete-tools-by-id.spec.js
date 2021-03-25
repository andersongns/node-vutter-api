const { DeleteToolsByIdUseCase } = require('../../../src/domain/tools')
const { ToolsRepository } = require('../../../src/infra/db/mongodb')
const { MissingDependenceError, MissingParamError } = require('../../../src/utils/errors')

const createDependencies = () => {
  ToolsRepository.deleteById = jest.fn(() => true)
  return ToolsRepository
}

const makeSut = () => {
  const toolsRepository = createDependencies()
  return {
    sut: new DeleteToolsByIdUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}

describe('Delete Tools By Id UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    expect(() => new DeleteToolsByIdUseCase(invalid)).toThrow(new MissingDependenceError('toolsRepository'))
  })

  test('Should throws if id is not provided', async () => {
    const { sut } = makeSut()
    expect(sut.deleteById()).rejects.toThrow(new MissingParamError('id'))
  })

  test('Should delete a tools with correct id params', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const tool = await sut.deleteById(1)

    expect(toolsRepositorySpy.deleteById).toHaveBeenCalledWith(1)
    expect(tool).toBe(true)
  })

  test('Should delete a tools with incorrect id params', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    toolsRepositorySpy.deleteById = jest.fn(() => false)
    const tool = await sut.deleteById(1)

    expect(toolsRepositorySpy.deleteById).toHaveBeenCalledWith(1)
    expect(tool).toBe(false)
  })
})
