const { HttpResponse } = require('../../helpers')
const { DependenceNotFoundError } = require('../../../utils/errors')

module.exports = class AuthenticationRouter {
  constructor ({ authenticationUseCase }) {
    if (!authenticationUseCase) throw new DependenceNotFoundError()
    this.authenticationUseCase = authenticationUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      const user = await this.authenticationUseCase.auth(email, password)
      return HttpResponse.ok(user)
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
