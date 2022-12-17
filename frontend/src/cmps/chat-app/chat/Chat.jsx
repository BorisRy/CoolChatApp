import { useState } from "react"
import { MessageInput } from "./MessageInput"
import { useEffect } from "react"
import { messageService } from "../../../services/message.service"
import { socketService } from "../../../services/socket.service"
import { useDispatch, useSelector } from "react-redux"
import { resetNotifications } from "../../../store/chat/chat.actions"
import { useParams } from "react-router-dom"
import { useMediaQuery, Flex } from '@chakra-ui/react'
import { Listener } from "../../general/Listener"

export const Chat = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const { loggedInUser } = useSelector(state => state.userModule)
    const { chats } = useSelector(state => state.chatModule)
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')


    useEffect(() => {
        socketService.on('chat-add-msg', addMessage)
        return () => {
            socketService.off('chat-add-msg', addMessage)
        }
    }, [])

    useEffect(() => {
        const currentChat = chats.find(chat => chat._id === params.chatId)
        if (currentChat?.unread > 0) {
            dispatch(resetNotifications(params.chatId, loggedInUser._id))
        }
        loadMessages()
    }, [params.chatId])


    const loadMessages = async () => {
        setIsLoading(true)
        const messages = await messageService.query({ chat: params.chatId })
        setMessages(messages)
        setIsLoading(false)
    }

    const addMessage = (message) => {
        dispatch({ type: 'UPDATE_LAST_MESSAGE', message })
        setMessages(prevMessages => [...prevMessages, message])
    }

    return (
        <Flex direction={'column'} px={4} h='100%' maxH='100%' position='relative' height={!isLargerThan800 ? `${window.innerHeight}px` : 'calc(90vh)'}>
            {/* <MessageLog messages={messages} isLoading={isLoading} />
            <MessageInput addMessage={addMessage} />
            {!isLargerThan800 && <Listener />} */}
        </Flex>
    )
}

