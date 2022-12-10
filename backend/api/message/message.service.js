const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
    const criteria = filterBy
    try {
        const collection = await dbService.getCollection('message')
        let messages = await collection.find({ chatId: filterBy.chat }).toArray()
        return messages
    } catch (err) {
        logger.error('Could not find messages')
        throw err
    }
}

async function add(message) {
    try {
        const collection = await dbService.getCollection('message')
        await collection.insertOne(message)
        return message
    } catch (error) {

    }
}

module.exports = {
    query,
    add
}