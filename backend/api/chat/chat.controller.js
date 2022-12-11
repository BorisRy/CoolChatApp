const chatService = require('./chat.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const { logout } = require('../auth/auth.controller')


async function getChats(req, res) {
    try {
        const { userId } = req.query
        let chats = await chatService.query(userId)

        chats.forEach(chat => {
            const participantIdx = chat.participants.findIndex(p => p._id === userId)
            chat.unread = chat.notifications[userId]
            chat.participants.splice(participantIdx, 1)
            chat.with = chat.participants[0]
            delete chat.participants
            delete chat.notifications
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
        chat.lastMessage = { text: 'New chat!', author: { _id: '' }, sentAt: Date.now() }
        chat.notifications = chat.participants.reduce((a, p) => {
            a[p._id] = 0
            return a
        }, {})
        if (chat.isGroup) {
            const newGroupChat = await chatService.add(chat)

            res.send(newGroupChat)

        } else {
            const newPrivateChat = await chatService.add(chat)
            newPrivateChat.participants.forEach(async p => {
                const chats = await chatService.query(p._id)
                chats.forEach(chat => {
                    const participantIdx = chat.participants.findIndex(pr => pr._id === p._id)
                    chat.unread = chat.notifications[p._id]
                    chat.participants.splice(participantIdx, 1)
                    chat.with = chat.participants[0]
                    delete chat.participants
                    delete chat.notifications
                })
                await socketService.emitToUser({ type: 'update-user-chats', data: chats, userId: p._id })
            })
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

async function resetNotifications(req, res) {
    try {
        const { chatId, userId } = req.body
        const chat = await chatService.getById(chatId)
        chat.notifications[userId] = 0
        const response = await chatService.update(chat)
        res.send(response)
    } catch (error) {
        console.log('error:', error)
    }
}

module.exports = {
    getChats,
    addChat,
    resetNotifications
}