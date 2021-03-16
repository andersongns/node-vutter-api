const ok = (body) => {
  return {
    statusCode: 200,
    body
  }
}

const created = (body) => {
  return {
    statusCode: 201,
    body
  }
}

const noContent = () => {
  return {
    statusCode: 204
  }
}

const badRequest = (error) => {
  return {
    statusCode: 400,
    body: {
      error: error?.message
    }
  }
}

const notFound = (error) => {
  return {
    statusCode: 404,
    body: {
      error: error?.message
    }
  }
}

const unauthorizedError = (error) => {
  return {
    statusCode: 401,
    body: {
      error: error?.message
    }
  }
}

const serverError = (error) => {
  return {
    statusCode: error?.statusCode || 500,
    body: {
      error: error?.message
    }
  }
}

module.exports = {
  ok,
  created,
  noContent,
  notFound,
  badRequest,
  unauthorizedError,
  serverError
}
