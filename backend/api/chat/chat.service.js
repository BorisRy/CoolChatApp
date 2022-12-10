const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')

async function query(userId) {

    try {
        const collection = await dbService.getCollection('chat')
        let chats = await collection.find({ "participants._id": userId }).toArray()
        return chats
    } catch (error) {
        logger.error('Could not find chats', error)
        return error
    }
}

async function getById(chatId) {
    try {
        const collection = await dbService.getCollection('chat')
        let chat = await collection.findOne({ '_id': ObjectId(userId) })
        return chat
    } catch (error) {
        logger.error('Could not find chat', error)
        return error
    }
}

async function add(chat) {
    try {
        const collection = await dbService.getCollection('chat')
        let newChat = await collection.insertOne(chat)

        return chat
    } catch (error) {
        logger.error('Could not add chat', error)
        return error
    }
}

async function update(chat) {
    try {
        const collection = await dbService.getCollection('chat')
        const updated = await collection.updateOne({ '_id': chat._id }, { $set: chat })
        logger.debug(`chat ${chat._id} updated`)
        return updated
    } catch (error) {
        logger.error(`cannot update chat ${chat._id}`, error)
        throw error
    }
}

async function remove(chatId) {
    try {
        const collection = await dbService.getCollection('chat')
        await collection.deleteOne({ '_id': ObjectId(chatId) })
        logger.debug(`User ${chatId} removed`)
    } catch (error) {
        logger.error(`cannot remove chat ${chatId}`, error)
        throw error
    }
}

async function setUserStatus(userId, status) {

    try {
        console.log('userId:', userId.toString())
        console.log('status:', status)
        const collection = await dbService.getCollection('chat')
        const res = await collection.update(
            { "participants._id": userId.toString() },
            { "$set": { "participants.$[elem].status": status } },
            { "arrayFilters": [{ "elem._id": userId.toString() }], "multi": true }
        )
        console.log('res:', res)
    } catch (error) {
        console.log('err setuserstatus:', error)
    }
}

module.exports = {
    query,
    getById,
    add,
    remove,
    update,
    setUserStatus
}