const { UnauthorizedError, DependenceNotFoundError, MissingParamError } = require('../../utils/errors')
module.exports = class AuthenticationUseCase {
  constructor ({ usersRepository, hashGenerator, tokenJwtGenerator }) {
    if (!usersRepository || !hashGenerator || !tokenJwtGenerator) throw new DependenceNotFoundError()
    this.usersRepository = usersRepository
    this.hashGenerator = hashGenerator
    this.tokenJwtGenerator = tokenJwtGenerator
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const user = await this.usersRepository.findByEmail(email)
    if (user?.password !== this.hashGenerator.generate(password)) throw new UnauthorizedError()
    const token = await this.tokenJwtGenerator.generate(user.id)
    const { id, name } = user
    await this.usersRepository.updateById(id, { token })
    return {
      id, name, token
    }
  }
}
