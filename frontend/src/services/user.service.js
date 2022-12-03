// import { socketService } from './socket.service'
// import { httpService } from "./http.service"

const USER_KEY = 'user_key'

export const userService = {
    createEmptyUser,
}

// async function login(credentials) {
//     try {
//         const user = await httpService.post('auth/login', credentials)
//         sessionStorage.setItem(USER_KEY, JSON.stringify(user))
//         // socketService.login(user._id)
//         return user
//     }
//     catch (err) {
//         let errorMsg = err.response.data.err
//         return Promise.reject(`${errorMsg}`)
//     }
// }

// async function signup(signUpDetails) {
//     try {
//         let user = await httpService.post('auth/signup', signUpDetails)
//         return user
//     } catch (err) {
//         let errorMsg = err.response.data.err
//         return Promise.reject(`${errorMsg}`)
//     }
// }

// async function logout(userId) {
//     sessionStorage.removeItem(USER_KEY)
//     // socketService.logout()
//     return await httpService.post('auth/logout', { userId })
// }

// async function sendFriendRequest(request) {
//     try {
//         let confirmation = await httpService.post('friend/send', request)
//         return confirmation
//     } catch (err) {
//         let errorMsg = err.response.data.err
//         return Promise.reject(`${errorMsg}`)
//     }
// }

// async function handleFriendRequest(request) {
//     try {
//         const response = await httpService.post('friend/handle', request)
//         console.log('response from user SERVICE:', response)
//         return response
//     }
//     catch (error) {

//     }
// }

// async function removeFriend(request) {
//     try {
//         console.log('request user service:', request)
//         const updatedUser = await httpService.post('friend/remove', request)
//         return updatedUser
//     } catch (error) {

//     }
// }

// function getLoggedInUser() {
//     return JSON.parse(sessionStorage.getItem(USER_KEY))
// }

// function setLoggedInUser(user) {
//     sessionStorage.setItem(USER_KEY, JSON.stringify(user))
// }

function createEmptyUser() {
    return {
        email: '',
        password: '',
        alias: '',
        avatar: 'https://res.cloudinary.com/dowk59699/image/upload/v1670049331/discord-avatar-512-BMLJ5_k1ufnx.png'
    }
}

// function createRequestResponse(action, handlerId, request) {
//     let response
//     if (action === 'cancel') {
//         response = {
//             requestId: request._id,
//             senderId: handlerId,
//             recepientId: request.userInfo.id,
//             action
//         }
//     } else {
//         response = {
//             requestId: request._id,
//             senderId: request.userInfo.id,
//             recepientId: handlerId,
//             action
//         }
//     }
//     return response
// }