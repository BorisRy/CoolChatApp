var gIo = null

const logger = require('../services/logger.service')
const userService = require('../api/user/user.service')
const chatService = require('../api/chat/chat.service')
const messageService = require('../api/message/message.service')
const uniqid = require('uniqid');

async function setupSocketAPI(http) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    gIo.on('connection', socket => {
        console.log('Socket connected id:', socket.id)
        let gUserId
        socket.on('disconnect', async socket => {
            if (gUserId) {
                const user = await userService.getById(gUserId)
                user.status = 'offline'
                await userService.update(user)
                gIo.emit('update-user-status', { userId: gUserId, status: 'offline' })
            }
        })

        socket.on('chat-send-message', async message => {

            message.key = uniqid()
            message.chatId = socket.chat
            const chat = await chatService.getById(message.chatId)
            const sockets = await _getAllSockets()
            const connectedParticipants = sockets.filter(s => s.userId && s.chat === message.chatId).map(s => s.userId)
            const disconnectedParticipants = chat.participants.map(p => p._id.toString()).filter(pId => {
                return !connectedParticipants.includes(pId)
            })

            const updatedChat = await chatService.pushNotification(message, disconnectedParticipants)
            console.log('disconnectedParticipants:', disconnectedParticipants)
            if (disconnectedParticipants.length > 0) {
                disconnectedParticipants.forEach(async pId => (
                    await emitToUser({
                        type: 'chat-notify-message',
                        data: message,
                        userId: pId
                    }),
                    await emitToUser({
                        type: 'set-notifications-count',
                        data: { chatId: updatedChat._id, count: updatedChat.notifications[pId] },
                        userId: pId
                    })
                ))
            }

            socket.broadcast.to(socket.chat).emit('chat-add-msg', message)
            await messageService.add(message)
        })

        socket.on('set-chat-room', chatId => {
            if (socket.chat === chatId) return
            if (socket.chat) {
                socket.leave(socket.chat)
            }

            socket.join(chatId)
            socket.chat = chatId
        })

        socket.on('leave-chat-room', chatId => {
            if (socket.chat) {
                socket.leave(socket.chat)
                delete socket.chat
            }
        })

        socket.on('is-user-typing', data => {
            socket.broadcast.emit('set-user-typing', data)
        })

        socket.on('set-user-socket', userId => {
            socket.userId = userId
            gUserId = userId
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            gIo.emit('update-user-status', { userId: gUserId, status: 'online' })
        })

        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        })

        socket.on('is-typing', alias => {
            gIo.to(socket.channel).emit('set-typing', alias)
        })
    })
}

function emitTo({ type, data, label }) {
    if (label) gIo.to('watching:' + label.toString()).emit(type, data)
    else gIo.emit(type, data)
}

async function emitToUser({ type, data, userId }) {
    userId = userId?.toString()
    const socket = await _getUserSocket(userId)
    if (socket) {
        logger.info(`Emiting event: ${type} to user: ${userId} socket [id: ${socket.id}]`)
        socket.emit(type, data)
    } else {
        logger.info(`No active socket for user: ${userId}`)
    }
}

// If possible, send to all sockets BUT not the current socket 
// Optionally, broadcast to a room / to all
async function broadcast({ type, data, room = null, userId }) {
    userId = userId?.toString()
    var excludedSocket = null
    logger.info(`Broadcasting event: ${type}`)
    if (userId) { excludedSocket = await _getUserSocket(userId) }
    if (room && excludedSocket) {
        logger.info(`Broadcast to room ${room} excluding user: ${userId}`)
        excludedSocket.broadcast.to(room).emit(type, data)
    } else if (excludedSocket) {
        logger.info(`Broadcast to all excluding user: ${userId}`)
        excludedSocket.broadcast.emit(type, data)
    } else if (room) {
        logger.info(`Emit to room: ${room}`)
        gIo.to(room).emit(type, data)
    } else {
        logger.info(`Emit to all`)
        gIo.emit(type, data)
    }
}


async function _getUserSocket(userId) {
    const sockets = await _getAllSockets()
    const socket = sockets.find(s => {
        return s.userId === userId.toString()
    })

    return socket
}

async function _getAllSockets() {
    const sockets = await gIo.fetchSockets()
    return sockets
}

async function _printSockets() {
    const sockets = await _getAllSockets()
    console.log(`Sockets: (count: ${sockets.length}):`)
    sockets.forEach(_printSocket)
}

function _printSocket(socket) {
    console.log(`Socket - socketId: ${socket.id} userId: ${socket.userId}`)
}




module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    // emit to everyone / everyone in a specific room (label)
    emitTo,
    // emit to a specific user (if currently active in system)
    emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
    broadcast,
}
