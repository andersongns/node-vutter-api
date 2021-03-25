const { DeleteToolsByIdRouter } = require('../../../../src/presentation/routers/tools')
const { MissingDependenceError, DependenceNotFoundError, MissingParamError } = require('../../../../src/utils/errors')
const faker = require('faker')

const deleteToolsByIdUseCaseSpy = () => {
  const deleteById = async (id) => {
    if (!id) throw new MissingParamError('id')
    return true
  }

  return {
    deleteById
  }
}

const deleteToolsByIdUseCaseSpyError = () => {
  const deleteById = async (tool) => {
    throw new Error('mock')
  }
  return {
    deleteById
  }
}

const makeSut = () => {
  const deleteToolsByIdUseCase = deleteToolsByIdUseCaseSpy()
  const sut = new DeleteToolsByIdRouter({ deleteToolsByIdUseCase })

  return {
    deleteToolsByIdUseCase,
    sut
  }
}

describe('Delete Tools By Id Router', () => {
  test('Should return 204 with correct params', async () => {
    const params = {
      id: faker.random.uuid()
    }
    const { sut } = makeSut()
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(204)
    expect(httpResponse.body).toBeFalsy()
  })

  test('Should return 404 when not found id', async () => {
    const params = {
      id: faker.random.uuid()
    }
    const { sut, deleteToolsByIdUseCase } = makeSut()
    deleteToolsByIdUseCase.deleteById = () => Promise.resolve(false)
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body.error).toBe(`${params.id} not found`)
  })

  test('Should return 500 when no dependencies is provided throws', async () => {
    expect(() => new DeleteToolsByIdRouter({ })).toThrow(new DependenceNotFoundError())
  })

  test('Should return 500 when deleteToolsByIdUseCase throws', async () => {
    const params = {}
    const sut = new DeleteToolsByIdRouter({ deleteToolsByIdUseCase: deleteToolsByIdUseCaseSpyError() })
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 500 when deleteToolsByIdUseCase throws', async () => {
    const dependencies = { deleteToolsByIdUseCase: {} }
    expect(() => new DeleteToolsByIdRouter(dependencies)).toThrow(new MissingDependenceError('deleteToolsByIdUseCase'))
  })

  test('Should return 400 when MissingParamError throws', async () => {
    const params = {}
    const { sut } = makeSut()
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('id').message)
  })
})
