const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')
const uniqid = require('uniqid');
const { Logger } = require('mongodb');

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('users')
        let users = await collection.find(criteria).toArray()

        return users
    } catch (err) {
        logger.error('Could not find users')
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('users')
        const user = await collection.findOne({ '_id': ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}


async function add(user) {
    try {
        const userToAdd = user
        userToAdd.status = 'online'
        userToAdd.tag = '#' + await _createTag(userToAdd.alias)
        const collection = await dbService.getCollection('users')
        await collection.insertOne(userToAdd)

        return userToAdd
    } catch (err) {
        logger.error(`Could not add user ${user.username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('users')
        await collection.deleteOne({ '_id': ObjectId(userId) })
        logger.debug(`User ${userId} removed`)
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const collection = await dbService.getCollection('users')
        await collection.updateOne({ '_id': user._id }, { $set: user })
        logger.debug(`user ${user._id} updated`)
        return user
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}



async function _createTag(alias) {
    let users = await query({ alias })
    let tag = utilService.getRandomInt(0, 9999)
    if (users.length > 0) {
        const userTags = users.map(u => u.tag)
        while (userTags.includes(tag)) {
            tag = utilService.getRandomInt(0, 9999)
        }
    }
    return tag
}

const _buildCriteria = (filterBy) => {
    const criteria = {}
    if (filterBy.alias) {
        const alias = { $regex: filterBy.alias, $options: 'i' }
        criteria.alias = alias
    }
    if (filterBy.tag) {
        const tag = { $regex: filterBy.tag, $options: 'i' }
        criteria.tag = tag
    }
    if (filterBy.email) {
        const email = { $regex: filterBy.email, $options: 'i' }
        criteria.email = email
    }
    return criteria
}



module.exports = {
    query,
    getById,
    add,
    remove,
    update,
}