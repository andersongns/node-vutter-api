const bcrypt = require('bcrypt')
const { MissingDependenceError, MissingParamError } = require('../errors')

module.exports = class HashBcryptGenerator {
  constructor (salt) {
    if (!salt) throw new MissingDependenceError('salt')
    this.salt = salt
  }

  async generate (value) {
    if (!value) throw new MissingParamError('value')
    return bcrypt.hash(value, this.salt)
  }

  async verify (value, hashedValue) {
    if (!value) throw new MissingParamError('value')
    if (!hashedValue) throw new MissingParamError('hashedValue')
    return bcrypt.compare(value, hashedValue)
  }
}
