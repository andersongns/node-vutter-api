const { AuthenticationRouter } = require('../../../../src/presentation/routers/authentication')
const { DependenceNotFoundError, MissingParamError } = require('../../../../src/utils/errors')
const faker = require('faker')

const authenticationUseCaseSpyError = () => {
  const auth = async (email, password) => {
    throw new Error('mock')
  }

  return {
    auth
  }
}

const authenticationUseCaseSpy = () => {
  const auth = async (email, password) => {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')
    return {
      id: 1,
      name: 'any_name',
      token: 'any_token'
    }
  }

  return {
    auth
  }
}

const makeSut = () => {
  const authenticationUseCase = authenticationUseCaseSpy()
  const sut = new AuthenticationRouter({ authenticationUseCase })

  return {
    authenticationUseCase,
    sut
  }
}

describe('auth Tools Router', () => {
  test('Should return 200 with correct params', async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.id).toBeTruthy()
    expect(httpResponse.body.name).toBeTruthy()
    expect(httpResponse.body.token).toBeTruthy()
  })

  test('Should return 500 when no dependencies is provided throws', async () => {
    expect(() => new AuthenticationRouter({ })).toThrow(new DependenceNotFoundError())
  })

  test('Should return 500 when authenticationUseCase throws', async () => {
    const body = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }
    const sut = new AuthenticationRouter({ authenticationUseCase: authenticationUseCaseSpyError() })
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 400 when email MissingParamError throws', async () => {
    const body = {}
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('email').message)
  })

  test('Should return 400 when password MissingParamError throws', async () => {
    const body = {
      email: faker.internet.email()
    }
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('password').message)
  })
})
