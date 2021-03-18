const faker = require('faker')
const { mongoHelper } = require('../../../../src/infra/db/mongodb/helpers')
const { toolsRepository } = require('../../../../src/infra/db/mongodb')
const { ObjectId } = require('mongodb')
const { errors: { InvalidParamError } } = require('../../../../src/utils')

describe('Unit Tools Repository ', () => {
  let toolsCollection
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    toolsCollection = await mongoHelper.getCollection(toolsRepository.COLLECTION_NAME)
  })

  beforeEach(async () => {
    await toolsCollection.deleteMany()
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })

  describe('add tool', () => {
    test('Should return an tool with id', async () => {
      const props = [
        'id',
        'title',
        'link',
        'description',
        'tags'
      ]
      const result = await toolsRepository.add({
        title: faker.random.word(),
        link: faker.internet.domainName(),
        description: faker.lorem.paragraph(1),
        tags: faker.lorem.words(5).split(' ')
      })
      props.forEach((prop) => expect(result).toHaveProperty(prop))
    })
  })

  describe('Delete By Id', () => {
    test('Should return true if delete with success', async () => {
      const tool = await toolsRepository.add({
        title: faker.random.word(),
        link: faker.internet.domainName(),
        description: faker.lorem.paragraph(1),
        tags: faker.lorem.words(5).split(' ')
      })
      const result = await toolsRepository.deleteById(tool.id)
      expect(result).toBe(true)
    })

    test('Should throws if invalid id if provided', async () => {
      const result = toolsRepository.deleteById('any_value')
      expect(result).rejects.toThrow(new InvalidParamError('id'))
    })

    test('Should return false if id not exists', async () => {
      const result = await toolsRepository.deleteById(ObjectId())
      expect(result).toBe(false)
    })
  })

  describe('Get Tools', () => {
    test('Should return tools', async () => {
      const props = [
        'id',
        'title',
        'link',
        'description',
        'tags'
      ]

      await Promise.all([
        toolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        }),
        toolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        })
      ])

      const result = await toolsRepository.get()
      expect(result.length).toBe(2)
      props.forEach((prop) => expect(result[0]).toHaveProperty(prop))
    })

    test('Should return an empty array when no has data in database', async () => {
      const result = await toolsRepository.get()
      expect(result.length).toBe(0)
    })
  })

  describe('Get Tools By Tag', () => {
    test('Should return tools when tag is provided', async () => {
      const props = [
        'id',
        'title',
        'link',
        'description',
        'tags'
      ]

      const tags = ['any_tag']

      await Promise.all([
        toolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags
        }),
        toolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        })
      ])

      const result = await toolsRepository.getByTag(tags[0])
      expect(result.length).toBe(1)
      props.forEach((prop) => expect(result[0]).toHaveProperty(prop))
    })

    test('Should return an empty array when no has data in database', async () => {
      const result = await toolsRepository.getByTag('any_value')
      expect(result.length).toBe(0)
    })
  })
})
