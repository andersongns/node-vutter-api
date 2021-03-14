const { tools: { getToolsByTagUseCase } } = require('../../../../src/domain/usecases')
const { MissingDependenceError, MissingParamError } = require('../../../../src/utils/errors')

const { mockGetToolsByTag } = require('./mocks')

const toolsRepositorySpy = () => {
  const getByTag = jest.fn().mockReturnValue(mockGetToolsByTag)
  return {
    getByTag
  }
}

const makeSut = () => {
  const toolsRepository = toolsRepositorySpy()
  return {
    sut: getToolsByTagUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}

describe('Get Tools By Tag UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    const sut = getToolsByTagUseCase(invalid)
    expect(sut.getToolsByTag()).rejects.toThrow(new MissingDependenceError('toolsRepository'))
  })

  test('Should throws if no params is provided', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const promise = sut.getToolsByTag()
    expect(promise).rejects.toThrow(new MissingParamError('tag'))
    expect(toolsRepositorySpy.getByTag).not.toHaveBeenCalled()
  })

  test('Should return a tools list by tag', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const tools = await sut.getToolsByTag('node')

    const keys = [
      'id',
      'title',
      'link',
      'description',
      'tags'
    ]

    expect(toolsRepositorySpy.getByTag).toHaveBeenCalled()
    expect(tools).toBeTruthy()
    expect(tools.length).toBe(2)
    expect(tools).toEqual(mockGetToolsByTag)
    expect(Object.keys(tools[0])).toEqual(keys)
  })

  test('Should return a empty tools list by tag', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    toolsRepositorySpy.getByTag = jest.fn().mockReturnValue([])
    const tools = await sut.getToolsByTag('node')
    expect(toolsRepositorySpy.getByTag).toHaveBeenCalled()
    expect(tools).toBeTruthy()
    expect(tools.length).toBe(0)
    expect(tools).toEqual([])
  })
})
