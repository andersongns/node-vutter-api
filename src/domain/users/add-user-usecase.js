const { DependenceNotFoundError, MissingParamError, DuplicatedKeyError, InvalidParamError } = require('../../utils/errors')

module.exports = class AddUserUseCase {
  constructor ({ usersRepository, tokenJwtGenerator, hashGenerator, validator }) {
    if (!usersRepository || !tokenJwtGenerator || !hashGenerator || !validator) throw new DependenceNotFoundError()
    this.usersRepository = usersRepository
    this.tokenJwtGenerator = tokenJwtGenerator
    this.hashGenerator = hashGenerator
    this.validator = validator
  }

  async add (user) {
    const { name, email, password } = user

    if (!name) throw new MissingParamError('name')
    if (!email) throw new MissingParamError('email')
    if (!this.validator.isEmailValid(email)) throw new InvalidParamError('email')
    if (!password) throw new MissingParamError('password')

    const hasUserByEmail = await this.usersRepository.findByEmail(email)
    if (hasUserByEmail?.email) throw new DuplicatedKeyError('email')
    const hashPassword = await this.hashGenerator.generate(password)
    const { id } = await this.usersRepository.add({
      ...user,
      password: hashPassword
    })
    const token = await this.tokenJwtGenerator.generate({ id })

    return {
      id, name, token
    }
  }
}
