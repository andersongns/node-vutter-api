const { getToolsRouter } = require('../../../../src/presentation/routers/tools')
const { errors: { MissingDependenceError } } = require('../../../../src/utils')
const faker = require('faker')

const getToolsByTagUseCaseSpy = () => {
  const getToolsByTag = async () => {
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

const getToolsUseCaseSpy = () => {
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

const getToolsByTagUseCaseSpyError = () => {
  const getToolsByTag = async (tag) => {
    throw new Error('mock')
  }
  return {
    getToolsByTag
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
  const getToolsUseCase = getToolsUseCaseSpy()
  const getToolsByTagUseCase = getToolsByTagUseCaseSpy()
  const sut = getToolsRouter({ getToolsUseCase, getToolsByTagUseCase })

  return {
    getToolsUseCase,
    sut
  }
}

describe('Get Tools Router', () => {
  test('Should return 200 without query params', async () => {
    const keys = [
      'id',
      'title',
      'link',
      'description',
      'tags'
    ]
    const query = { }
    const { sut } = makeSut()
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBeTruthy()
    expect(httpResponse.body[0]).toBeTruthy()
    expect(Object.keys(httpResponse.body[0])).toEqual(keys)
  })
  test('Should return 200 with query params', async () => {
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
    const sut = getToolsRouter({ getToolsUseCase: getToolsUseCaseSpyError(), getToolsByTagUseCase: {} })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 500 when getToolsByTagUseCase throws', async () => {
    const query = {
      tag: faker.random.word()
    }
    const sut = getToolsRouter({ getToolsUseCase: {}, getToolsByTagUseCase: getToolsByTagUseCaseSpyError() })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })
})
