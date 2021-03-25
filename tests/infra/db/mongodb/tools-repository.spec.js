const faker = require('faker')
const { MongoHelper } = require('../../../../src/infra/db/mongodb/helpers')
const { ToolsRepository } = require('../../../../src/infra/db/mongodb')
const { ObjectId } = require('mongodb')
const { InvalidParamError } = require('../../../../src/utils/errors')
const COLLECTION_NAME = 'tools'

describe('Unit Tools Repository ', () => {
  let toolsCollection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    toolsCollection = await MongoHelper.getCollection(COLLECTION_NAME)
  })

  beforeEach(async () => {
    await toolsCollection.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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
      const result = await ToolsRepository.add({
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
      const tool = await ToolsRepository.add({
        title: faker.random.word(),
        link: faker.internet.domainName(),
        description: faker.lorem.paragraph(1),
        tags: faker.lorem.words(5).split(' ')
      })
      const result = await ToolsRepository.deleteById(tool.id)
      expect(result).toBe(true)
    })

    test('Should throws if invalid id if provided', async () => {
      const result = ToolsRepository.deleteById('any_value')
      expect(result).rejects.toThrow(new InvalidParamError('id'))
    })

    test('Should return false if id not exists', async () => {
      const result = await ToolsRepository.deleteById(ObjectId())
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
        ToolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        }),
        ToolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        })
      ])

      const result = await ToolsRepository.get()
      expect(result.length).toBe(2)
      props.forEach((prop) => expect(result[0]).toHaveProperty(prop))
    })

    test('Should return an empty array when no has data in database', async () => {
      const result = await ToolsRepository.get()
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
        ToolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags
        }),
        ToolsRepository.add({
          title: faker.random.word(),
          link: faker.internet.domainName(),
          description: faker.lorem.paragraph(1),
          tags: faker.lorem.words(5).split(' ')
        })
      ])

      const result = await ToolsRepository.getByTag(tags[0])
      expect(result.length).toBe(1)
      props.forEach((prop) => expect(result[0]).toHaveProperty(prop))
    })

    test('Should return an empty array when no has data in database', async () => {
      const result = await ToolsRepository.getByTag('any_value')
      expect(result.length).toBe(0)
    })
  })
})
