const { AddUserUseCase } = require('../../../domain/users')
const { UserRepository } = require('../../../infra/db/mongodb')
const { hashBcryptGeneratorFactory, tokenJwtGeneratorFactory, validatorFactory } = require('../helpers')

const dependencies = {
  usersRepository: UserRepository,
  hashGenerator: hashBcryptGeneratorFactory,
  tokenJwtGenerator: tokenJwtGeneratorFactory,
  validator: validatorFactory
}

module.exports = {
  addUserUseCase: new AddUserUseCase(dependencies)
}
