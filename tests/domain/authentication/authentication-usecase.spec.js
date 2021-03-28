const { AuthenticationUseCase } = require('../../../src/domain/authentication')
const { DependenceNotFoundError, MissingParamError, UnauthorizedError } = require('../../../src/utils/errors')

const makeSut = () => {
  const usersRepository = {
    findByEmail: jest.fn(email => ({ id: 1, email, name: 'any_name', password: 'any_hash_generator' })),
    updateById: jest.fn()
  }
  const tokenJwtGenerator = { generate: jest.fn(() => 'any_token_jwt_generator') }
  const hashGenerator = { verify: jest.fn(() => true) }
  return {
    sut: new AuthenticationUseCase({ usersRepository, tokenJwtGenerator, hashGenerator }),
    usersRepository,
    tokenJwtGenerator,
    hashGenerator
  }
}

describe('Authentication UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const dependencies = [
      {},
      { usersRepository: { findByEmail () { } } },
      { usersRepository: { findByEmail () { } }, tokenJwtGenerator: { generate () { } } }
    ]
    dependencies.forEach(dependence => {
      expect(() => new AuthenticationUseCase(dependence)).toThrow(new DependenceNotFoundError())
    })
  })

  test('Should throws if no email is provided', async () => {
    const { sut } = makeSut()
    expect(sut.auth()).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throws if password is not provided', async () => {
    const { sut } = makeSut()
    expect(sut.auth('any_email@email.com')).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should throws if UnauthorizedError user and password not found', async () => {
    const { sut, usersRepository } = makeSut()
    usersRepository.findByEmail = jest.fn().mockReturnValueOnce()
    expect(sut.auth('any_email@email.com', 'any_password')).rejects.toThrow(new UnauthorizedError())
  })

  test('Should auth with success', async () => {
    const { sut, usersRepository } = makeSut()
    const user = await sut.auth('any_email@email.com', 'any_password')

    expect(usersRepository.findByEmail).toHaveBeenCalled()
    expect(usersRepository.updateById).toHaveBeenCalled()
    expect(user).toBeTruthy()
    expect(user).toEqual({
      id: 1,
      name: 'any_name',
      token: 'any_token_jwt_generator'
    })
    expect(Object.keys(user)).toEqual([
      'id',
      'name',
      'token'
    ])
  })

  test('Should auth with invalid password', async () => {
    const { sut, hashGenerator } = makeSut()
    hashGenerator.verify = jest.fn(() => false)
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow(new UnauthorizedError())
  })
})
