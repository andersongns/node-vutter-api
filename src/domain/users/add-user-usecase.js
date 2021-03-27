const { DependenceNotFoundError, MissingParamError, DuplicatedKeyError } = require('../../utils/errors')

module.exports = class AddUserUseCase {
  constructor ({ usersRepository, tokenJwtGenerator, hashGenerator }) {
    if (!usersRepository || !tokenJwtGenerator || !hashGenerator) throw new DependenceNotFoundError()
    this.usersRepository = usersRepository
    this.tokenJwtGenerator = tokenJwtGenerator
    this.hashGenerator = hashGenerator
  }

  async add (user) {
    const { name, email, password } = user

    if (!name) throw new MissingParamError('name')
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const hasUserByEmail = await this.usersRepository.findByEmail(email)
    if (hasUserByEmail?.email) throw new DuplicatedKeyError('email')
    const hashPassword = this.hashGenerator.generate(password)
    const { id } = await this.usersRepository.add({
      ...user,
      password: hashPassword
    })
    const token = await this.tokenJwtGenerator.generate(id)

    return {
      id, name, token
    }
  }
}
