const { HttpResponse } = require('../../helpers')
const { DependenceNotFoundError } = require('../../../utils/errors')

module.exports = class AddUserTouter {
  constructor ({ addUserUseCase }) {
    if (!addUserUseCase) throw new DependenceNotFoundError()
    this.addUserUseCase = addUserUseCase
  }

  async route (httpRequest) {
    try {
      const user = await this.addUserUseCase.add(httpRequest.body)
      return HttpResponse.created(user)
    } catch (error) {
      return HttpResponse.serverError(error)
    }
  }
}
