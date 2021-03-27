const { AddUserRouter } = require('../../../../src/presentation/routers/users')
const { DependenceNotFoundError, MissingParamError } = require('../../../../src/utils/errors')
const faker = require('faker')

const addUsersUseCaseSpyError = () => {
  const add = async (user) => {
    throw new Error('mock')
  }

  return {
    add
  }
}

const addUsersUseCaseSpy = () => {
  const add = async (user) => {
    if (!user.email) throw new MissingParamError('email')
    return {
      id: 1,
      ...user,
      token: 'any_token'
    }
  }

  return {
    add
  }
}

const makeSut = () => {
  const addUserUseCase = addUsersUseCaseSpy()
  const sut = new AddUserRouter({ addUserUseCase })

  return {
    addUserUseCase,
    sut
  }
}

describe('Add Tools Router', () => {
  test('Should return 201 with correct params', async () => {
    const body = {
      email: faker.internet.email(),
      name: faker.internet.domainName(),
      password: faker.internet.password()
    }
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.id).toBeTruthy()
    expect(httpResponse.body.email).toBe(httpRequest.body.email)
    expect(httpResponse.body.name).toBe(httpRequest.body.name)
    expect(httpResponse.body.password).toBe(httpRequest.body.password)
    expect(httpResponse.body.token).toBeTruthy()
  })

  test('Should return 500 when no dependencies is provided throws', async () => {
    expect(() => new AddUserRouter({ })).toThrow(new DependenceNotFoundError())
  })

  test('Should return 500 when addUsersUseCase throws', async () => {
    const body = {}
    const sut = new AddUserRouter({ addUserUseCase: addUsersUseCaseSpyError() })
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 400 when MissingParamError throws', async () => {
    const body = {}
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
  })
})
