const { mongoHelper } = require('../mongodb/helpers')
const { InvalidParamError } = require('../../../utils/errors')

const COLLECTION_NAME = 'tools'

const add = async (tool) => {
  const toolsCollection = await mongoHelper.getCollection(COLLECTION_NAME)
  const { ops } = await toolsCollection.insertOne(tool)
  return mongoHelper.parserItem(ops.find(Boolean))
}

const deleteById = async (id) => {
  if (!mongoHelper.isObjectId(id)) throw new InvalidParamError('id')
  const toolsCollection = await mongoHelper.getCollection(COLLECTION_NAME)
  const result = await toolsCollection.deleteOne({ _id: id })
  return result.deletedCount === 1
}

const getByTag = async (tag) => {
  const toolsCollection = await mongoHelper.getCollection(COLLECTION_NAME)
  const tools = await toolsCollection.find({ tags: { $in: [tag] } }).toArray()
  return mongoHelper.parserCollection(tools)
}

const get = async () => {
  const toolsCollection = await mongoHelper.getCollection(COLLECTION_NAME)
  const tools = await toolsCollection.find().toArray()
  return mongoHelper.parserCollection(tools)
}

module.exports = {
  add,
  deleteById,
  getByTag,
  get,
  COLLECTION_NAME
}
