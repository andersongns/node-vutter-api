const { tools: { deleteToolsByIdRouter } } = require('../../../../src/presentation/routers')
const { errors: { MissingDependenceError, MissingParamError } } = require('../../../../src/utils')
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
  const sut = deleteToolsByIdRouter({ deleteToolsByIdUseCase })

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

  test('Should return 500 when no dependencies is provided throws', async () => {
    const params = {}
    const sut = deleteToolsByIdRouter({ })
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new MissingDependenceError('deleteToolsByIdUseCase').message)
  })

  test('Should return 500 when deleteToolsByIdUseCase throws', async () => {
    const params = {}
    const sut = deleteToolsByIdRouter({ deleteToolsByIdUseCase: deleteToolsByIdUseCaseSpyError() })
    const httpRequest = { params }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
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
