const { UnauthorizedError, DependenceNotFoundError, MissingParamError, InvalidParamError } = require('../../utils/errors')
module.exports = class AuthenticationUseCase {
  constructor ({ usersRepository, hashGenerator, tokenJwtGenerator, validator }) {
    if (!usersRepository || !hashGenerator || !tokenJwtGenerator || !validator) throw new DependenceNotFoundError()
    this.usersRepository = usersRepository
    this.hashGenerator = hashGenerator
    this.tokenJwtGenerator = tokenJwtGenerator
    this.validator = validator
  }

  async auth (email, password) {
    if (!email) throw new MissingParamError('email')
    if (!this.validator.isEmailValid(email)) throw new InvalidParamError('email')
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
