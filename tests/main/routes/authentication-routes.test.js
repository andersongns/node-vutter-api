const request = require('supertest')
const app = require('../../../src/main/config/app')
const { HashBcryptGenerator } = require('../../../src/utils/helpers')
const { MongoHelper } = require('../../../src/infra/db/mongodb/helpers')
const { UserRepository } = require('../../../src/infra/db/mongodb')
let usersCollection

const COLLECTION_NAME = 'users'
const hashBcryptGenerator = new HashBcryptGenerator(10)
describe('Authentication Routes', () => {
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

  test('Should return 200 when valid credentials are provided', async () => {
    await UserRepository.add({
      email: 'valid_email@mail.com',
      password: await hashBcryptGenerator.generate('hashed_password')
    })
    await request(app)
      .post('/api/v1/auth')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(200)
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/v1/auth')
      .send({
        email: 'valid_email@mail.com',
        password: 'hashed_password'
      })
      .expect(401)
  })
})
