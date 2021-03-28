const { isEmail } = require('validator').default

module.exports = class Validator {
  static isEmailValid (email) {
    return isEmail(email)
  }
}
