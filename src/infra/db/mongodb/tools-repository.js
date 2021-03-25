const { MongoHelper } = require('../mongodb/helpers')
const { InvalidParamError } = require('../../../utils/errors')

const COLLECTION_NAME = 'tools'
module.exports = class ToolsRepository {
  static async add (tool) {
    const toolsCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const { ops } = await toolsCollection.insertOne(tool)
    return MongoHelper.parserItem(ops.find(Boolean))
  }

  static async deleteById (id) {
    if (!MongoHelper.isObjectId(id)) throw new InvalidParamError('id')
    const toolsCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const result = await toolsCollection.deleteOne({ _id: MongoHelper.toObjectId(id) })
    return result.deletedCount === 1
  }

  static async getByTag (tag) {
    const toolsCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const tools = await toolsCollection.find({ tags: { $in: [tag] } }).toArray()
    return MongoHelper.parserCollection(tools)
  }

  static async get () {
    const toolsCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const tools = await toolsCollection.find().toArray()
    return MongoHelper.parserCollection(tools)
  }
}
