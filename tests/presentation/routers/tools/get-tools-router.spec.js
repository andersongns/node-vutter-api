const { tools: { getToolsRouter } } = require('../../../../src/presentation/routers')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')
const faker = require('faker')

const getToolsByTagUseCaseSpy = () => {
  const getTools = async () => {
    return [{
      id: faker.random.uuid(),
      title: faker.random.word(),
      link: faker.internet.domainName(),
      description: faker.lorem.paragraph(1),
      tags: faker.lorem.words(5).split(' ')
    }]
  }

  return {
    getTools
  }
}

const getToolsUseCaseSpyError = () => {
  const getTools = async () => {
    throw new Error('mock')
  }
  return {
    getTools
  }
}

const makeSut = () => {
  const getToolsUseCase = getToolsByTagUseCaseSpy()
  const sut = getToolsRouter({ getToolsUseCase })

  return {
    getToolsUseCase,
    sut
  }
}

describe('Get Tools Router', () => {
  test('Should return 200 with correct query', async () => {
    const keys = [
      'id',
      'title',
      'link',
      'description',
      'tags'
    ]
    const query = {
      tag: faker.random.word()
    }
    const { sut } = makeSut()
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBeTruthy()
    expect(httpResponse.body[0]).toBeTruthy()
    expect(Object.keys(httpResponse.body[0])).toEqual(keys)
  })

  test('Should return 500 when no dependencies is provided throws', async () => {
    const query = {}
    const sut = getToolsRouter({ })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new MissingDependenceError('getToolsUseCase').message)
  })

  test('Should return 500 when getToolsUseCase throws', async () => {
    const query = {}
    const sut = getToolsRouter({ getToolsUseCase: getToolsUseCaseSpyError() })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })
})
