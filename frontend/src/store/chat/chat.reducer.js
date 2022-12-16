const initialState = {
    chats: null,
}

export function chatReducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_CHATS':
            return { ...state, chats: action.chats }
        case 'UPDATE_USER_STATUS':
            var { userId, status } = action.userInfo
            var chat = state.chats.find(chat => chat.with._id === userId)
            if (chat) chat.with.status = status
            return { ...state }
        case 'UPDATE_CHATS':
            return { ...state, chats: [...action.chats] }
        case 'UPDATE_LAST_MESSAGE':
            var chat = state.chats.find(chat => chat._id === action.message.chatId)
            chat.lastMessage = action.message
            return { ...state }
        case 'SET_NOTIFICATIONS_COUNT':
            var chat = state.chats.find(chat => chat._id === action.data.chatId)
            chat.unread = action.data.count
            return { ...state }
        case 'SET_USER_TYPING':
            var { chatId, userId, isTyping } = action.data
            var chat = state.chats.find(chat => chat._id === chatId)
            if (!chat) return
            chat.with.typing = isTyping
            return { ...state }

        default: return { ...state }
    }
}