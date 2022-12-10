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