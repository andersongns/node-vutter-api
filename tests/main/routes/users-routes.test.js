const request = require('supertest')
const app = require('../../../src/main/config/app')
const { MongoHelper } = require('../../../src/infra/db/mongodb/helpers')
let usersCollection

const COLLECTION_NAME = 'tools'
describe('Login Routes', () => {
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

  test('/POST users', (done) => {
    request(app)
      .post('/api/v1/users')
      .send({
        name: 'Anderson Santos',
        email: 'any_email@email.com',
        password: 'any_password'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)

        const { body } = res
        expect(body).toBeTruthy()
        expect(typeof body.id).toBe('string')
        expect(typeof body.name).toBe('string')
        expect(typeof body.token).toBe('string')
        done()
      })
  })
})
