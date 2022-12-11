import { httpService } from "./http.service"

export const chatService = {
    createChat,
    addChat,
    query,
    resetNotifications
}

async function query(userId) {
    try {
        const userChats = await httpService.get('chat/', { userId })
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

async function resetNotifications(chatId, userId) {
    try {
        await httpService.post('chat/reset', { chatId, userId })
    } catch (error) {

    }
}

function createChat(isGroup, ...users) {
    return {
        isGroup,
        participants: users,
    }
}