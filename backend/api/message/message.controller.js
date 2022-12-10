const messageService = require('./message.service')
const logger = require('../../services/logger.service')

async function getMessages(req, res) {
    try {
        const filterBy = req.query
        const messages = await messageService.query(filterBy)
        res.send(messages)
    } catch (err) {
        logger.error('Failed to get messages', err)
        res.status(500).send({ err: 'Failed to get messages' })
    }
}

module.exports = {
    getMessages
}