const bcrypt = require('bcrypt')
const Cryptr = require('cryptr')
const logger = require('../../services/logger.service')
const userService = require('../user/user.service')


const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Sauce-2403')

async function login(credentials) {
    try {
        let { email, password } = credentials
        const user = await userService.query({ email })
        if (user.length === 0) throw 'User with this email does not exist.'
        const match = await bcrypt.compare(password + '', user[0].password + '')
        if (!match) throw 'Incorrect Username or password.'
        user[0].status = 'online'
        await userService.update(user[0])

        logger.debug(`auth.service - user: ${email} logged in`)
        delete user[0].password

        return user[0]
    } catch (err) {
        return err
    }

}

async function signup(credentials) {
    let { email, password } = credentials
    const saltRounds = 10

    const hash = await bcrypt.hash(password + '', saltRounds)
    logger.debug(`auth.service - sign up with e-mail: ${email}`)
    let newUser = await userService.add({ ...credentials, password: hash })
    return newUser
}


function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}