const { Validator } = require('../../../src/utils/helpers')

describe('Validator', () => {
  test('Should return true if is a valid email', async () => {
    Validator.isEmailValid = jest.fn(email => true)
    const isValid = Validator.isEmailValid('valid_email@email.com')
    expect(isValid).toBeTruthy()
  })

  test('Should return true if is a invalid email', async () => {
    Validator.isEmailValid = jest.fn(email => false)
    const isValid = Validator.isEmailValid('invalid_email@email.com')
    expect(isValid).toBeFalsy()
  })
})
