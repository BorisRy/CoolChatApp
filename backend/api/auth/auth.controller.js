const authService = require('./auth.service')
const userService = require('../user/user.service')
const chatService = require('../chat/chat.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function login(req, res) {
    try {
        const user = await authService.login(req.body)
        const loginToken = authService.getLoginToken(user)
        socketService.broadcast({
            type: 'update-user-status',
            data: { userId: user._id, status: 'online' },
            userId: user._id
        })
        res.cookie('loginToken', loginToken)
        res.json(user)
    }
    catch (err) {
        logger.error('Failed to Login ' + err)
        res.status(401).send({ err: 'Failed to login. Incorrect username or password.' })
    }
}

async function signup(req, res) {
    try {
        const { email } = req.body
        let existingUser = await userService.query({ email })

        if (existingUser.length > 0) {
            throw 'Failed to sign up. This email is already in use.'
        }

        let newUser = await authService.signup(req.body)

        const user = await authService.login(req.body)
        const loginToken = authService.getLoginToken(user)
        logger.info(`User ${user.username} logged in`)
        res.cookie('loginToken', loginToken)

        delete user.password


        res.json(user)
    } catch (err) {
        res.status(401).send({ err })
    }
}

async function logout(req, res) {
    try {
        let { userId } = req.body
        const user = await userService.getById(userId)
        user.status = 'offline'
        await userService.update(user)
        await chatService.setUserStatus(user._id, 'offline')
        socketService.broadcast({
            type: 'update-user-status',
            data: { userId: user._id, status: 'offline' },
            userId: user._id
        })

        res.clearCookie('loginToken')
        res.send({ msg: 'Logged out successfully' })
    } catch (err) {
        console.log('err HEREEE:', err)
        res.status(500).send({ err: 'Failed to logout' })
    }
}


module.exports = {
    signup,
    login,
    logout
}