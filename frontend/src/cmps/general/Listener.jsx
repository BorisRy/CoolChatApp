
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { socketService } from "../../services/socket.service"
import { toast } from "react-toastify"
import { NewMsgToast } from "./NewMsgToast"
import sound from '../../assets/notification.mp3'

const audio = new Audio(sound)
audio.volume = 0.2

export const Listener = () => {
    const dispatch = useDispatch()
    const { chats } = useSelector(state => state.chatModule)


    useEffect(() => {
        console.log('listening...')
        socketService.on('update-user-status', updateUserStatus)
        socketService.on('update-user-chats', updateChats)
        socketService.on('chat-notify-message', notifyMessage)
        socketService.on('set-notifications-count', setNotificationCount)
        socketService.on('set-user-typing', setUserStatus)
        return () => {
            socketService.off('update-user-status', updateUserStatus)
            socketService.off('update-chats', updateChats)
            socketService.off('chat-notify-message', notifyMessage)
            socketService.off('set-notifications-count', setNotificationCount)
            socketService.off('set-user-typing', setUserStatus)
        }
    }, [])


    const updateUserStatus = (userInfo) => {
        dispatch({ type: 'UPDATE_USER_STATUS', userInfo })
    }

    const updateChats = (chats) => {
        dispatch({ type: 'UPDATE_CHATS', chats })
    }

    const notifyMessage = (message) => {
        audio.play()
            .then(() => {

            }).catch((error) => {

            })
        toast(<NewMsgToast message={message} />, { toastId: message.key })
        dispatch({ type: 'UPDATE_LAST_MESSAGE', message })
    }

    const setNotificationCount = (data) => {
        dispatch({ type: 'SET_NOTIFICATIONS_COUNT', data })
    }

    const setUserStatus = (data) => {
        dispatch({ type: 'SET_USER_TYPING', data })
    }

    return (<></>)
}