const { AuthenticationRouter } = require('../../../presentation/routers/authentication')
const usecases = require('../usecases/authentication-usecase-factory')

module.exports = {
  authenticationRouter: new AuthenticationRouter(usecases)
}
