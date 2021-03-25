const { GetToolsUseCase } = require('../../../src/domain/tools')
const { ToolsRepository } = require('../../../src/infra/db/mongodb')
const { MissingDependenceError } = require('../../../src/utils/errors')

const { mockGetTools } = require('./mocks')

const createDependencies = () => {
  ToolsRepository.get = jest.fn().mockReturnValue(mockGetTools)
  return ToolsRepository
}

const makeSut = () => {
  const toolsRepository = createDependencies()
  return {
    sut: new GetToolsUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}
describe('Get Tools UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    expect(() => new GetToolsUseCase(invalid)).toThrow(new MissingDependenceError('toolsRepository'))
  })

  test('Should return a tools list', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const tools = await sut.getTools()

    const keys = [
      'id',
      'title',
      'link',
      'description',
      'tags'
    ]

    expect(toolsRepositorySpy.get).toHaveBeenCalled()
    expect(tools).toBeTruthy()
    expect(tools.length).toBe(3)
    expect(tools).toEqual(mockGetTools)
    expect(Object.keys(tools[0])).toEqual(keys)
  })

  test('Should return a empty tools list', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    toolsRepositorySpy.get = jest.fn().mockReturnValue([])
    const tools = await sut.getTools()
    expect(toolsRepositorySpy.get).toHaveBeenCalled()
    expect(tools).toBeTruthy()
    expect(tools.length).toBe(0)
    expect(tools).toEqual([])
  })
})
