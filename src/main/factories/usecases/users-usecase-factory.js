const { AddUserUseCase } = require('../../../domain/users')
const { UserRepository } = require('../../../infra/db/mongodb')
const { hashBcryptGeneratorFactory, tokenJwtGeneratorFactory } = require('../helpers')

const dependencies = {
  usersRepository: UserRepository,
  hashGenerator: hashBcryptGeneratorFactory,
  tokenJwtGenerator: tokenJwtGeneratorFactory
}

module.exports = {
  addUserUseCase: new AddUserUseCase(dependencies)
}
