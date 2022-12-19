import { Grid, GridItem, useMediaQuery } from '@chakra-ui/react'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { socketService } from "../../services/socket.service"
import { ChatNav } from "./ChatNav"
import { MessageLog } from "./chat/MessageLog"
import { MessageInput } from "./chat/MessageInput"
import { messageService } from '../../services/message.service'
import { resetNotifications } from "../../store/chat/chat.actions"
import { Listener } from "../general/Listener"

export const ChatWindow = () => {
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentChat, setCurrentChat] = useState(null)
    const { chats } = useSelector(state => state.chatModule)
    const { loggedInUser } = useSelector(state => state.userModule)
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')


    useEffect(() => {
        if (!chats) navigate('/chat')
        const currChat = chats?.find(chat => chat._id === params.chatId)
        setCurrentChat(currChat)
        socketService.emit('set-chat-room', params.chatId)

        socketService.on('chat-add-msg', addMessage)
        return () => {
            socketService.off('chat-add-msg', addMessage)
            socketService.emit('leave-chat-room', params.chatId)
        }
    }, [])

    useEffect(() => {
        const currChat = chats?.find(chat => chat._id === params.chatId)
        setCurrentChat(currChat)
        socketService.emit('set-chat-room', params.chatId)

        if (currChat?.unread > 0) {
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

    if (!currentChat) return <>Loading</>
    return (
        <Grid
            bg='gray.800'
            templateRows='50px 1fr 50px'
            w='100%'
            maxW='800px'
            maxH={isLargerThan800 ? 'calc(100vh - 2em)' : '100%'}
            minH={!isLargerThan800 && '100%'}
        >
            <GridItem>
                <ChatNav currentChat={currentChat} />
            </GridItem>
            <GridItem overflow={'hidden'} alignContent='center'>
                <MessageLog messages={messages} isLoading={isLoading} />
            </GridItem>
            <GridItem>
                <MessageInput addMessage={addMessage} chat={currentChat} />
            </GridItem>
        </Grid>
    )
}

