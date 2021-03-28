const {
  AuthenticationUseCase
} = require('../../../domain/authentication')
const { UserRepository } = require('../../../infra/db/mongodb')
const { hashBcryptGeneratorFactory, tokenJwtGeneratorFactory, validatorFactory } = require('../helpers')

const dependencies = {
  usersRepository: UserRepository,
  hashGenerator: hashBcryptGeneratorFactory,
  tokenJwtGenerator: tokenJwtGeneratorFactory,
  validator: validatorFactory
}

module.exports = {
  authenticationUseCase: new AuthenticationUseCase(dependencies)
}
