import { chatService } from "../../services/chat.service"

export function loadChats(userId) {
    console.log('userId:', userId)
    return async (dispatch) => {
        try {
            const chats = await chatService.query(userId)
            dispatch({ type: 'SET_CHATS', chats })
        } catch (error) {
            return error
        }

    }
}


export function addChat(chat) {
    return async (dispatch) => {
        try {
            const newChat = await chatService.addChat(chat)
        } catch (error) {

        }
    }
}

export function resetNotifications(chatId, userId) {
    return async (dispatch) => {
        try {
            const response = await chatService.resetNotifications(chatId, userId)
            console.log('response:', response)
            dispatch({ type: 'SET_NOTIFICATIONS_COUNT', data: { chatId, count: 0 } })
        } catch (error) {
            console.log('error:', error)
        }
    }

}