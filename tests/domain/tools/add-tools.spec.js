const { AddToolsUseCase } = require('../../../src/domain/tools')
const { ToolsRepository } = require('../../../src/infra/db/mongodb')
const { MissingDependenceError, MissingParamError } = require('../../../src/utils/errors')

const { mockAddTools } = require('./mocks')

const createDependencies = () => {
  ToolsRepository.add = jest.fn(tool => ({ id: 1, ...tool }))
  return ToolsRepository
}

const makeSut = () => {
  const toolsRepository = createDependencies()
  return {
    sut: new AddToolsUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}

describe('Add Tools UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    expect(() => new AddToolsUseCase(invalid)).toThrow(new MissingDependenceError('toolsRepository'))
  })

  test('Should throws if title is not provided', async () => {
    const { sut } = makeSut()
    expect(sut.add({})).rejects.toThrow(new MissingParamError('title'))
  })

  test('Should add a new tools with correct params', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const tool = await sut.add(mockAddTools)
    expect(toolsRepositorySpy.add).toHaveBeenCalledWith(mockAddTools)
    expect(tool).toBeTruthy()
    expect(tool).toEqual({ id: 1, ...mockAddTools })
    expect(Object.keys(tool)).toEqual([
      'id',
      'title',
      'link',
      'description',
      'tags'
    ])
  })
})
