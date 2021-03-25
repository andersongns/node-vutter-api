jest.mock('jsonwebtoken', () => ({
  token: 'any_token',

  sign (payload) {
    this.payload = payload
    return this.token
  },

  verify (payload, secret) {
    this.payload = payload
    this.secret = secret
    return this.token
  }
}))

const jwt = require('jsonwebtoken')
const { MissingDependenceError, MissingParamError } = require('../../../src/utils/errors')
const { TokenJwtGenerator } = require('../../../src/utils/helpers')

const makeSut = () => {
  return new TokenJwtGenerator('secret')
}

describe('TokenJwtGenerator', () => {
  test('Should throw if no secret is provided', async () => {
    expect(() => new TokenJwtGenerator()).toThrow(new MissingDependenceError('secret'))
  })

  test('Should return a token any value is provided', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBeTruthy()
  })

  test('Should throw if no value is provided', async () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })

  test('Should valid content if valid token is provided', async () => {
    const sut = makeSut()
    const token = await sut.verify('any_token')
    expect(token).toBeTruthy()
  })
  test('Should throws if a invalid token is provided', async () => {
    const sut = makeSut()
    jwt.verify = () => { throw new Error() }
    const promise = sut.verify('invalid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throws if no token is provided', async () => {
    const sut = makeSut()
    const promise = sut.verify()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })
})
