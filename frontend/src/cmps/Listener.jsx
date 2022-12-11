import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { socketService } from "../services/socket.service"
// import { toastifyService } from "../services/toastify.service"


export const Listener = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('listening...')
        socketService.on('update-user-status', updateUserStatus)
        socketService.on('update-user-chats', updateChats)
        socketService.on('chat-notify-message', notifyMessage)
        socketService.on('set_notifications_count', setNotificationCount)
        return () => {
            socketService.off('update-user-status', updateUserStatus)
            socketService.off('update-chats', updateChats)
        }
    }, [])
    // dispatch({ type: 'INCREMENT_NOTIFICATIONS', chatId })

    const updateUserStatus = (userInfo) => {
        dispatch({ type: 'UPDATE_USER_STATUS', userInfo })
    }

    const updateChats = (chats) => {
        dispatch({ type: 'UPDATE_CHATS', chats })
    }

    const notifyMessage = (message) => {

        dispatch({ type: 'UPDATE_LAST_MESSAGE', message })
    }

    const setNotificationCount = (data) => {
        dispatch({ type: 'SET_NOTIFICATIONS_COUNT', data })
    }
    return <></>
}