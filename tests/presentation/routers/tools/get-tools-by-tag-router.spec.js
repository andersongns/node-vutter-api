const { tools: { getToolsByTagRouter } } = require('../../../../src/presentation/routers')
const { errors: { MissingDependenceError, MissingParamError } } = require('../../../../src/utils')
const faker = require('faker')

const getToolsByTagUseCaseSpy = () => {
  const getToolsByTag = async (tag) => {
    if (!tag) throw new MissingParamError('tag')
    return [{
      id: faker.random.uuid(),
      title: faker.random.word(),
      link: faker.internet.domainName(),
      description: faker.lorem.paragraph(1),
      tags: faker.lorem.words(5).split(' ')
    }]
  }

  return {
    getToolsByTag
  }
}

const getToolsByTagUseCaseSpyError = () => {
  const getToolsByTag = async (tag) => {
    throw new Error('mock')
  }
  return {
    getToolsByTag
  }
}

const makeSut = () => {
  const getToolsByTagUseCase = getToolsByTagUseCaseSpy()
  const sut = getToolsByTagRouter({ getToolsByTagUseCase })

  return {
    getToolsByTagRouter,
    sut
  }
}

describe('Get Tools By Tag Router', () => {
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
    const sut = getToolsByTagRouter({ })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new MissingDependenceError('getToolsByTagUseCase').message)
  })

  test('Should return 500 when getToolsByTagUseCase throws', async () => {
    const query = {}
    const sut = getToolsByTagRouter({ getToolsByTagUseCase: getToolsByTagUseCaseSpyError() })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 400 when MissingParamError throws', async () => {
    const query = {}
    const { sut } = makeSut()
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('tag').message)
  })
})
