const chatService = require('./chat.service')
const logger = require('../../services/logger.service')


async function getChats(req, res) {
    try {
        const { userId } = req.query
        let chats = await chatService.query(userId)

        chats.forEach(chat => {
            const idx = chat.participants.findIndex(p => p._id === userId)
            chat.participants.splice(idx, 1)
            chat.with = chat.participants[0]
            delete chat.participants
        })

        res.send(chats)
    } catch (error) {
        logger.error('Failed to get chats', error)
        res.status(500).send({ error: 'Failed to get chats' })
    }
}

async function addChat(req, res) {
    try {
        const chat = req.body
        console.log('chat:', chat)
        if (chat.isGroup) {
            const newGroupChat = await chatService.add(chat)

            newGroupChat.lala = 'lala'
            res.send(newGroupChat)

        } else {
            const newPrivateChat = await chatService.add(chat)
            res.send(newPrivateChat)
        }
    } catch (error) {
        logger.error('Failed to delete chat', err)
        res.status(500).send({ err: 'Failed to delete chat' })
    }
}

async function deleteChat(req, res) {
    try {
        await chatService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete chat', err)
        res.status(500).send({ err: 'Failed to delete chat' })
    }
}

async function updateChat(req, res) {
    try {
        const chat = req.body
        if (chat._id) {
            const updatedChat = await chatService.update(chat)
            res.send(updatedChat)
        } else {
            const newChat = await chatService.add(chat)
            res.send(newChat)
        }

    } catch (err) {
        logger.error('Failed to update chat', err)
        res.status(500).send({ err: 'Failed to update chat' })
    }
}

module.exports = {
    getChats,
    addChat
}