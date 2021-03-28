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
    if (!user?.password) throw new UnauthorizedError()

    const isValid = await this.hashGenerator.verify(password, user.password)
    if (!isValid) throw new UnauthorizedError()

    const token = await this.tokenJwtGenerator.generate({ id: user.id })
    const { id, name } = user
    await this.usersRepository.updateById(id, { token })
    return {
      id, name, token
    }
  }
}
