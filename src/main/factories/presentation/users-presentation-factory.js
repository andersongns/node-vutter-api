const { AddUserRouter } = require('../../../presentation/routers/users')
const usecases = require('../usecases/users-usecase-factory')

module.exports = {
  addUserRouter: new AddUserRouter(usecases)
}
