
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId


async function query(userId) {

    try {
        const collection = await dbService.getCollection('chat')
        let chats = await collection.find({ "participants._id": userId }).toArray()
        chats.forEach(chat => {
            if (!chat.isGroup) {
                const participantIdx = chat.participants.findIndex(pr => pr._id === userId)
                chat.participants.splice(participantIdx, 1)
                chat.with = chat.participants[0]
                delete chat.participants
            } else {
                chat.with = {}
            }
            chat.with.typing = false
            chat.unread = chat.notifications[userId]
            delete chat.notifications
        })
        return chats
    } catch (error) {
        logger.error('Could not find chats', error)
        return error
    }
}

async function getById(chatId) {
    try {
        const collection = await dbService.getCollection('chat')
        let chat = await collection.findOne({ '_id': ObjectId(chatId) })
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
        const collection = await dbService.getCollection('chat')
        const res = await collection.update(
            { "participants._id": userId.toString() },
            { "$set": { "participants.$[elem].status": status } },
            { "arrayFilters": [{ "elem._id": userId.toString() }], "multi": true }
        )
    } catch (error) {
        console.log('err setuserstatus:', error)
    }
}

async function pushNotification(message, userIds) {
    try {
        const chat = await getById(message.chatId)
        userIds.forEach(async userId => {
            chat.notifications[userId] += 1
        })
        chat.lastMessage = message
        await update(chat)

        return chat
    } catch (error) {
        console.log('error:', error)
    }
}



module.exports = {
    query,
    getById,
    add,
    remove,
    update,
    setUserStatus,
    pushNotification,
}