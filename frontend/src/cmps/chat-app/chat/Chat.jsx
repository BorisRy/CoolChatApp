import { useState, useRef } from "react"
import { Flex, Box } from "@chakra-ui/react"
import { MessageInput } from "./MessageInput"
import { HeaderMessage, RegularMessage, MessageSkeleton } from "./Message"
import { useEffect } from "react"
import { messageService } from "../../../services/message.service"
import { socketService } from "../../../services/socket.service"
import { useDispatch, useSelector } from "react-redux"
import { resetNotifications } from "../../../store/chat/chat.actions"
import { useParams } from "react-router-dom"
import { useMediaQuery } from '@chakra-ui/react'
import { Listener } from "../../Listener"

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
        <Flex direction={'column'} px={4} h='100%' maxH='100%' position='relative' flex={1} height={!isLargerThan800 ? 'calc(100% - 110px)' : 'calc(90vh)'}>
            <MessageLog messages={messages} isLoading={isLoading} />
            <MessageInput addMessage={addMessage} />
            {!isLargerThan800 && <Listener />}
        </Flex>
    )
}

const MessageLog = ({ messages, isLoading }) => {
    const scrollRef = useRef(null)


    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const isHeaderMessage = (arr, idx) => {
        const isDifferentAuthor = arr[idx].author._id !== arr[idx - 1].author._id
        const didThreeMinutesPass = messageService.getTimeDiff(arr[idx].sentAt, arr[idx - 1].sentAt).mins >= 3
        return isDifferentAuthor || didThreeMinutesPass
    }

    const isDifferentDate = (timestamp1, timestamp2) => {
        return messageService.isDifferentDate(timestamp1, timestamp2)
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <Box className="scrollable" flex={1}>
            {<Flex
                direction='column'
                justify='flex-end'
                flexBasis='100%'>
                {!isLoading ?
                    messages.map((msg, idx, msgs) => {
                        if (idx === 0
                            || isDifferentDate(msgs[idx].sentAt, msgs[idx - 1].sentAt)
                            || isHeaderMessage(msgs, idx)) {
                            return <HeaderMessage message={msg} key={msg.key} />
                        }
                        else {
                            return <RegularMessage message={msg} key={msg.key} />
                        }
                    })
                    :
                    Array(20).fill(1).map((msg, idx) => <MessageSkeleton key={idx} />)
                }
            </Flex>}
            <div ref={scrollRef} className="scroll-to"></div>
        </Box>
    )
}


{/* <Message message={message} key={Math.ceil(Math.random() * Date.now())} /> */ }