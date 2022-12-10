const initialState = {
    chats: null
}

export function chatReducer(state = initialState, action = {}) {
    switch (action.type) {
        case 'SET_CHATS':
            return { ...state, chats: action.chats }
        case 'UPDATE_USER_STATUS':
            const { userId, status } = action.userInfo
            const chat = state.chats.find(chat => chat.with._id === userId)
            chat.with.status = status
            return { ...state }
        default: return { ...state }
    }
}