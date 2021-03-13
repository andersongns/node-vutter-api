const { tools: { getToolsUseCase } } = require('../../../../src/domain/usecases')
const { MissingDependenceError } = require('../../../../src/utils/errors')

const { mockGetTools } = require('./mocks')

const toolsRepositorySpy = () => {
  const get = jest.fn().mockReturnValue(mockGetTools)
  return {
    get
  }
}

const makeSut = () => {
  const toolsRepository = toolsRepositorySpy()
  return {
    sut: getToolsUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}
describe('Get Tools UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    const sut = getToolsUseCase(invalid)
    expect(sut.getTools()).rejects.toThrow(new MissingDependenceError('toolsRepository'))
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
