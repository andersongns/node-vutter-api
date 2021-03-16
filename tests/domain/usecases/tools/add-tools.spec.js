const { tools: { addToolsUseCase } } = require('../../../../src/domain/usecases')
const { errors: { MissingDependenceError, MissingParamError } } = require('../../../../src/utils')

const { mockAddTools } = require('./mocks')

const toolsRepositorySpy = () => {
  const add = jest.fn(tool => ({ id: 1, ...tool }))
  return {
    add
  }
}

const makeSut = () => {
  const toolsRepository = toolsRepositorySpy()
  return {
    sut: addToolsUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}

describe('Add Tools UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    const sut = addToolsUseCase(invalid)
    expect(sut.add()).rejects.toThrow(new MissingDependenceError('toolsRepository'))
  })

  test('Should throws if title is not provided', async () => {
    const { sut } = makeSut()
    expect(sut.add({})).rejects.toThrow(new MissingParamError('title'))
  })

  test('Should add a new tools with correct params', async () => {
    const { sut, toolsRepositorySpy } = makeSut()
    const tool = await sut.add(mockAddTools)

    const keys = [
      'id',
      'title',
      'link',
      'description',
      'tags'
    ]

    expect(toolsRepositorySpy.add).toHaveBeenCalledWith(mockAddTools)
    expect(tool).toBeTruthy()
    expect(tool).toEqual({ id: 1, ...mockAddTools })
    expect(Object.keys(tool)).toEqual(keys)
  })
})
