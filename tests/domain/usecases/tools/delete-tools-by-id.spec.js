const { tools: { deleteToolsByIdUseCase } } = require('../../../../src/domain/usecases')
const { MissingDependenceError, MissingParamError } = require('../../../../src/utils/errors')

const toolsRepositorySpy = () => {
  const deleteById = jest.fn(() => true)
  return {
    deleteById
  }
}

const makeSut = () => {
  const toolsRepository = toolsRepositorySpy()
  return {
    sut: deleteToolsByIdUseCase({ toolsRepository }),
    toolsRepositorySpy: toolsRepository
  }
}

describe('Delete Tools By Id UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const invalid = {}
    const sut = deleteToolsByIdUseCase(invalid)
    expect(sut.deleteById()).rejects.toThrow(new MissingDependenceError('toolsRepository'))
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
