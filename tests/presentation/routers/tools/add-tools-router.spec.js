const { AddToolsRouter } = require('../../../../src/presentation/routers/tools')
const { MissingDependenceError, DependenceNotFoundError, MissingParamError } = require('../../../../src/utils/errors')
const faker = require('faker')

const addToolsUseCaseSpy = () => {
  const add = async (tool) => {
    if (!tool.title) throw new MissingParamError('title')
    return {
      id: faker.random.uuid(),
      ...tool
    }
  }

  return {
    add
  }
}

const addToolsUseCaseSpyError = () => {
  const add = async (tool) => {
    throw new Error('mock')
  }
  return {
    add
  }
}

const makeSut = () => {
  const addToolsUseCase = addToolsUseCaseSpy()
  const sut = new AddToolsRouter({ addToolsUseCase })

  return {
    addToolsUseCase,
    sut
  }
}

describe('Add Tools Router', () => {
  test('Should return 201 with correct params', async () => {
    const body = {
      title: faker.random.word(),
      link: faker.internet.domainName(),
      description: faker.lorem.paragraph(1),
      tags: faker.lorem.words(5).split(' ')
    }
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body.id).toBeTruthy()
    expect(httpResponse.body.title).toBe(httpRequest.body.title)
    expect(httpResponse.body.link).toBe(httpRequest.body.link)
    expect(httpResponse.body.description).toBe(httpRequest.body.description)
    expect(httpResponse.body.tags).toBe(httpRequest.body.tags)
  })

  test('Should return 500 when no dependencies is provided throws', async () => {
    expect(() => new AddToolsRouter({ })).toThrow(new DependenceNotFoundError())
  })

  test('Should return 500 when no addToolsUseCase is provided throws', async () => {
    expect(() => new AddToolsRouter({ addToolsUseCase: {} })).toThrow(new MissingDependenceError('addToolsUseCase'))
  })

  test('Should return 500 when addToolsUseCase throws', async () => {
    const body = {}
    const sut = new AddToolsRouter({ addToolsUseCase: addToolsUseCaseSpyError() })
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body.error).toBe(new Error('mock').message)
  })

  test('Should return 400 when MissingParamError throws', async () => {
    const body = {}
    const { sut } = makeSut()
    const httpRequest = { body }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.error).toBe(new MissingParamError('title').message)
  })
})
