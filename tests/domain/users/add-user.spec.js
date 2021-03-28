const { AddUserUseCase } = require('../../../src/domain/users')
const { DependenceNotFoundError, MissingParamError, DuplicatedKeyError, InvalidParamError } = require('../../../src/utils/errors')

const { mockAddUser } = require('./mocks')

const makeSut = () => {
  const usersRepository = {
    add: jest.fn(user => ({ id: 1, ...user })),
    findByEmail: jest.fn(email => ({ id: 1, email }))
  }
  const tokenJwtGenerator = { generate: jest.fn(() => 'any_token_jwt_generator') }
  const hashGenerator = { generate: jest.fn(() => 'any_hash_generator') }
  const validator = { isEmailValid: jest.fn(() => true) }
  return {
    sut: new AddUserUseCase({ usersRepository, tokenJwtGenerator, hashGenerator, validator }),
    usersRepository,
    tokenJwtGenerator,
    hashGenerator,
    validator
  }
}

describe('Add User UseCase', () => {
  test('Should throws if invalid dependencies are provided', async () => {
    const dependencies = [
      {},
      { usersRepository: { add () { } } },
      { usersRepository: { add () { } }, tokenJwtGenerator: { generate () { } } }
    ]
    dependencies.forEach(dependence => {
      expect(() => new AddUserUseCase(dependence)).toThrow(new DependenceNotFoundError())
    })
  })

  test('Should throws if name is not provided', async () => {
    const { sut } = makeSut()
    const user = {}
    expect(sut.add(user)).rejects.toThrow(new MissingParamError('name'))
  })

  test('Should throws if email is not provided', async () => {
    const { sut } = makeSut()
    const {
      name
    } = mockAddUser
    expect(sut.add({ name })).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throws if invalid email is provided', async () => {
    const { sut, validator } = makeSut()
    validator.isEmailValid = jest.fn(() => false)
    const email = 'invalid_email'
    const {
      name
    } = mockAddUser
    expect(sut.add({ name, email })).rejects.toThrow(new InvalidParamError('email'))
  })

  test('Should throws if password is not provided', async () => {
    const { sut } = makeSut()
    const {
      name,
      email
    } = mockAddUser
    expect(sut.add({ name, email })).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should throws DuplicatedKeyError if email provided exists', async () => {
    const { sut } = makeSut()
    expect(sut.add(mockAddUser)).rejects.toThrow(new DuplicatedKeyError('email'))
  })

  test('Should add a new tools with correct params', async () => {
    const { sut, usersRepository } = makeSut()
    usersRepository.findByEmail = jest.fn().mockReturnValueOnce()
    const user = await sut.add(mockAddUser)
    expect(usersRepository.add).toHaveBeenCalled()
    expect(user).toBeTruthy()
    expect(user).toEqual({
      id: 1,
      name: 'Anderson Santos',
      token: 'any_token_jwt_generator'
    })
    expect(Object.keys(user)).toEqual([
      'id',
      'name',
      'token'
    ])
  })
})
