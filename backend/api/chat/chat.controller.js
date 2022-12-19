const chatService = require('./chat.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')
const { logout } = require('../auth/auth.controller')


async function getChats(req, res) {
    try {
        const { userId } = req.query
        let chats = await chatService.query(userId)

        console.log('chats:', chats)
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
        let newChat
        if (chat.isGroup) {
            chat.avatar = 'https://res.cloudinary.com/dowk59699/image/upload/v1671370814/2847004a27e0b86da62ed5fafe4fa18b_dwvk0s.png'
            newChat = await chatService.add(chat)
        } else {
            newChat = await chatService.add(chat)
        }

        newChat.participants.forEach(async p => {
            const chats = await chatService.query(p._id)
            await socketService.emitToUser({ type: 'update-user-chats', data: chats, userId: p._id })
        })

        res.send(newChat)
    } catch (error) {
        logger.error('Failed to add chat', error)
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

async function addToGroupChat(req, res) {
    try {
        const { chatId, users } = req.body
        const chat = await chatService.getById(chatId)

        chat.participants = [...chat.participants, ...users]
        users.forEach(user => chat.notifications[user._id] = 0)

        await chatService.update(chat)

        chat.participants.forEach(async participant => {
            const chats = await chatService.query(participant._id)
            await socketService.emitToUser({ type: 'update-user-chats', data: chats, userId: participant._id })
        })

    } catch (error) {

    }
}


module.exports = {
    getChats,
    addChat,
    resetNotifications,
    addToGroupChat
}