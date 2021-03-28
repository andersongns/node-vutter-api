const faker = require('faker')
const { MongoHelper } = require('../../../../src/infra/db/mongodb/helpers')
const { UserRepository } = require('../../../../src/infra/db/mongodb')
const { InvalidParamError } = require('../../../../src/utils/errors')
const COLLECTION_NAME = 'users'

describe('Unit Users Repository ', () => {
  let usersCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    usersCollection = await MongoHelper.getCollection(COLLECTION_NAME)
  })

  beforeEach(async () => {
    await usersCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Add User', () => {
    test('Should return an user with id', async () => {
      const user = await UserRepository.add({
        name: faker.random.word(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
      expect(Object.keys(user)).toEqual([
        'id',
        'name',
        'email',
        'password'
      ])
    })
  })
  describe('Find By Email', () => {
    test('Should return user', async () => {
      const email = faker.internet.email()

      await UserRepository.add({
        name: faker.random.word(),
        email,
        password: faker.internet.password()
      })

      const user = await UserRepository.findByEmail(email)
      expect(Object.keys(user)).toEqual([
        'id',
        'name',
        'email',
        'password'
      ])
    })

    test('Should return undefined when not found user', async () => {
      const email = faker.internet.email()
      const user = await UserRepository.findByEmail(email)
      expect(user).toBeFalsy()
    })
  })

  describe('Update By Id', () => {
    test('Should throw InvalidParamError when invalid id is provided', async () => {
      expect(UserRepository.updateById('invalid_id', {})).rejects.toThrow(new InvalidParamError('id'))
    })
    test('Should update user by id', async () => {
      const { id } = await UserRepository.add({
        name: faker.random.word(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })

      const email = faker.internet.email()

      const isUpdated = await UserRepository.updateById(id.toString(), { email })
      expect(isUpdated).toBeTruthy()
    })
  })
})
