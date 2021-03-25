const jwt = require('jsonwebtoken')
const { MissingDependenceError, MissingParamError } = require('../errors')

module.exports = class TokenJwtGenerator {
  constructor (secret) {
    if (!secret) throw new MissingDependenceError('secret')
    this.secret = secret
  }

  async generate (value) {
    if (!value) throw new MissingParamError('value')
    return jwt.sign(value, this.secret)
  }

  async verify (value) {
    if (!value) throw new MissingParamError('value')
    return jwt.verify(value, this.secret)
  }
}
