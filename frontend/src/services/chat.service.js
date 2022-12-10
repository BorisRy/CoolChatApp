import { httpService } from "./http.service"

export const chatService = {
    createChat,
    addChat,
    query
}

async function query(userId) {
    try {
        const userChats = await httpService.get('chat/', { userId })
        console.log('userChats:', userChats)
        return userChats
    } catch (error) {

    }
}

async function addChat(chatData) {
    try {
        const chat = await httpService.post('chat/add', chatData)
        return chat
    } catch (error) {

    }
}

function createChat(isGroup, ...users) {
    return {
        isGroup,
        participants: users,
    }
}