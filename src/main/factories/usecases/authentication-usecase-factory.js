const {
  AuthenticationUseCase
} = require('../../../domain/authentication')
const { HashBcryptGenerator, TokenJwtGenerator } = require('../../../utils/helpers')
const { UserRepository } = require('../../../infra/db/mongodb')

const dependencies = {
  usersRepository: UserRepository,
  hashGenerator: new HashBcryptGenerator(10),
  tokenJwtGenerator: new TokenJwtGenerator(process.env.JWT_SECRET)
}

module.exports = {
  authenticationUseCase: new AuthenticationUseCase(dependencies)
}
