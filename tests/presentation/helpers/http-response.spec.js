const { httpResponse } = require('../../../src/presentation/helpers')

describe('Unit HttpResponse', () => {
  test('ok', () => {
    const response = httpResponse.ok({ id: 'OK' })
    expect(response).toStrictEqual({ statusCode: 200, body: { id: 'OK' } })
  })
  test('created', () => {
    const response = httpResponse.created({ id: 'CREATED' })
    expect(response).toStrictEqual({ statusCode: 201, body: { id: 'CREATED' } })
  })
  test('notFound', () => {
    const response = httpResponse.notFound({ message: 'NOT_FOUND' })
    expect(response).toStrictEqual({ statusCode: 404, body: { error: 'NOT_FOUND' } })
  })
  test('badRequest', () => {
    const response = httpResponse.badRequest({ message: 'BAD_REQUEST' })
    expect(response).toStrictEqual({ statusCode: 400, body: { error: 'BAD_REQUEST' } })
  })

  test('unauthorizedError', () => {
    const response = httpResponse.unauthorizedError({ message: 'UNAUTHORIZED' })
    expect(response).toStrictEqual({ statusCode: 401, body: { error: 'UNAUTHORIZED' } })
  })
  test('serverError', () => {
    const response = httpResponse.serverError({ message: 'SERVER_ERROR' })
    expect(response).toStrictEqual({ statusCode: 500, body: { error: 'SERVER_ERROR' } })
  })
  test('serverError with statusCode', () => {
    const response = httpResponse.serverError({ statusCode: 999, message: 'SERVER_ERROR' })
    expect(response).toStrictEqual({ statusCode: 999, body: { error: 'SERVER_ERROR' } })
  })
})
