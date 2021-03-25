jest.mock('bcrypt', () => ({
  isValid: true,

  async hash (value) {
    this.value = value
    return this.value
  },

  async compare (value, hashedValue) {
    this.value = value
    this.hashedValue = hashedValue
    return this.isValid
  }
}))

const bcrypt = require('bcrypt')
const { MissingParamError, MissingDependenceError } = require('../../../src/utils/errors')
const { HashBcryptGenerator } = require('../../../src/utils/helpers')

const makeSut = () => {
  return new HashBcryptGenerator(10)
}

describe('HashBcryptGenerator', () => {
  test('Should throws when no salt is provided', async () => {
    expect(() => new HashBcryptGenerator()).toThrow(new MissingDependenceError('salt'))
  })

  test('Should throws when value params is no provided', async () => {
    const sut = makeSut()
    const promise = sut.verify()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })
  test('Should throws when hashedValue params is no provided', async () => {
    const sut = makeSut()
    const promise = sut.verify('value')
    expect(promise).rejects.toThrow(new MissingParamError('hashedValue'))
  })
  test('Should return true verify returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.verify('any_value', 'hashed_value')
    expect(isValid).toBe(true)
  })

  test('Should return false verify returns false', async () => {
    const sut = makeSut()
    bcrypt.isValid = false
    const isValid = await sut.verify('any_value', 'hashed_value')
    expect(isValid).toBe(false)
  })

  test('Should call compare with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_value')
    expect(bcrypt.value).toBe('any_value')
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.generate()).rejects.toThrow(new MissingParamError('value'))
  })
})
