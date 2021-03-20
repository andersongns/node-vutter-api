const request = require('supertest')
const app = require('../../../src/main/config/app')
const { mongoHelper } = require('../../../src/infra/db/mongodb/helpers')
const { toolsRepository } = require('../../../src/infra/db/mongodb')
let toolsCollection

const COLLECTION_NAME = 'tools'
describe('Login Routes', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    toolsCollection = await mongoHelper.getCollection(COLLECTION_NAME)
  })

  beforeEach(async () => {
    await toolsCollection.deleteMany()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  test('/POST tools', (done) => {
    request(app)
      .post('/api/v1/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description: 'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy']
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err)

        const { body } = res
        expect(body).toBeTruthy()
        expect(typeof body.id).toBe('string')
        expect(typeof body.title).toBe('string')
        expect(typeof body.link).toBe('string')
        expect(typeof body.description).toBe('string')
        body.tags.forEach(item => {
          expect(typeof item).toBe('string')
        })
        done()
      })
  })

  test('/GET tools', async (done) => {
    await toolsRepository.add({
      title: 'hotel',
      link: 'https://github.com/typicode/hotel',
      description: 'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
      tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy']
    })

    request(app)
      .get('/api/v1/tools')
      .expect(200)
      .expect('Content-Type', /json/).end((err, res) => {
        if (err) return done(err)

        const { body } = res
        expect(body).toBeTruthy()
        body.forEach(tool => {
          expect(typeof tool.id).toBe('string')
          expect(typeof tool.title).toBe('string')
          expect(typeof tool.link).toBe('string')
          expect(typeof tool.description).toBe('string')
          tool.tags.forEach(item => {
            expect(typeof item).toBe('string')
          })
          done()
        })
      })
  })

  test('Should return 200 when get tools by tag', async (done) => {
    const tools = [
      {
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description: 'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy']
      },
      {
        title: 'hotel 2',
        link: 'https://github.com/typicode/hotel',
        description: 'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['proxy']
      }
    ]

    tools.forEach(async tool => {
      await toolsRepository.add(tool)
    })

    request(app)
      .get('/api/v1/tools?tag=proxy')
      .expect(200)
      .expect('Content-Type', /json/).end((err, res) => {
        if (err) return done(err)

        const { body } = res
        expect(body).toBeTruthy()
        body.forEach(tool => {
          expect(typeof tool.id).toBe('string')
          expect(typeof tool.title).toBe('string')
          expect(typeof tool.link).toBe('string')
          expect(typeof tool.description).toBe('string')
          tool.tags.forEach(item => {
            expect(typeof item).toBe('string')
          })
          done()
        })
      })
  })

  test('Should return 404 when delete tools', async () => {
    await request(app)
      .delete('/api/v1/tools/6054dd82d5afcb42b81ce7b5')
      .expect(404)
      .expect('Content-Type', /json/)
  })

  test('Should return 204 when delete tools', (done) => {
    request(app)
      .post('/api/v1/tools')
      .send({
        title: 'hotel',
        link: 'https://github.com/typicode/hotel',
        description: 'Local app manager. Start apps within your browser, developer tool with local .localhost domain and https out of the box.',
        tags: ['node', 'organizing', 'webapps', 'domain', 'developer', 'https', 'proxy']
      })
      .expect(201)
      .end((err, res) => {
        if (err) done(err)
        const id = res.body.id

        request(app)
          .delete(`/api/v1/tools/${id}`)
          .expect(204)
          .expect('Content-Type', /json/)
          .end(() => {
            done()
          })
      })
  })
})
