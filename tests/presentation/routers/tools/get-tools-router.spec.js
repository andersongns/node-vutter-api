const { GetToolsRouter } = require('../../../../src/presentation/routers/tools')
const { DependenceNotFoundError, MissingDependenceError } = require('../../../../src/utils/errors')
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
  const sut = new GetToolsRouter({ getToolsUseCase, getToolsByTagUseCase })

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
    const query = {}
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
    expect(() => new GetToolsRouter({})).toThrow(new DependenceNotFoundError())
  })

  test('Should return 500 when getToolsUseCase throws', async () => {
    const query = {}
    const sut = new GetToolsRouter({ getToolsUseCase: getToolsUseCaseSpyError(), getToolsByTagUseCase: getToolsByTagUseCaseSpy() })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 500 when getToolsUseCase no has getTools', async () => {
    expect(() => new GetToolsRouter({ getToolsUseCase: {}, getToolsByTagUseCase: getToolsByTagUseCaseSpy() })).toThrow(new MissingDependenceError('getToolsUseCase'))
  })

  test('Should return 500 when getToolsByTagUseCase throws', async () => {
    const query = {
      tag: faker.random.word()
    }
    const sut = new GetToolsRouter({ getToolsUseCase: getToolsUseCaseSpy(), getToolsByTagUseCase: getToolsByTagUseCaseSpyError() })
    const httpRequest = { query }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 500 when getToolsByTagUseCase no has getToolsByTag', async () => {
    expect(() => new GetToolsRouter({ getToolsUseCase: getToolsUseCaseSpy(), getToolsByTagUseCase: {} })).toThrow(new MissingDependenceError('getToolsByTagUseCase'))
  })
})
