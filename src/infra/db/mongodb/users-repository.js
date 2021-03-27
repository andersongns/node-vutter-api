const { MongoHelper } = require('../mongodb/helpers')
const { InvalidParamError } = require('../../../utils/errors')

const COLLECTION_NAME = 'users'
module.exports = class UsersRepository {
  static async add (user) {
    const usersCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const { ops } = await usersCollection.insertOne(user)
    return MongoHelper.parserItem(ops.find(Boolean))
  }

  static async findByEmail (email) {
    const usersCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const user = await usersCollection.findOne({ email })
    return MongoHelper.parserItem(user)
  }

  static async updateById (id, user) {
    if (!MongoHelper.isObjectId(id)) throw new InvalidParamError('id')
    const usersCollection = await MongoHelper.getCollection(COLLECTION_NAME)
    const { result } = await usersCollection.updateOne({ _id: MongoHelper.toObjectId(id) }, { $set: { ...user } })
    return result.nModified === 1
  }
}
