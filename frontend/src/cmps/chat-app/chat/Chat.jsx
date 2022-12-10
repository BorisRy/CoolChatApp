import { useState, useRef } from "react"
import { Flex, Box } from "@chakra-ui/react"
import { MessageInput } from "./MessageInput"
import { HeaderMessage, RegularMessage } from "./Message"
import { useEffect } from "react"
import { messageService } from "../../../services/message.service"
import { socketService } from "../../../services/socket.service"


export const Chat = ({ currentChat }) => {

    const [messages, setMessages] = useState([])
    useEffect(() => {
        socketService.on('chat-add-msg', addMessage)

        return () => {
            socketService.off('chat-add-msg', addMessage)
        }
    }, [])

    useEffect(() => {
        const loadMessages = async () => {
            const messages = await messageService.query({ chat: currentChat._id })
            console.log('messages:', messages)
            setMessages(messages)
        }

        if (currentChat) loadMessages()
    }, [currentChat])

    const addMessage = (msgText) => {
        setMessages(prevMessages => [...prevMessages, msgText])
    }

    return (
        <Flex direction={'column'} px={4} h='100%' maxH='100%'>
            <MessageLog messages={messages} />
            <MessageInput addMessage={addMessage} />
        </Flex>
    )
}

const MessageLog = ({ messages }) => {
    const scrollRef = useRef(null)


    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const isHeaderMessage = (arr, idx) => {
        const isDifferentAuthor = arr[idx].author._id !== arr[idx - 1].author._id
        console.log('isDifferentAuthor:', isDifferentAuthor)
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
        <Box className="scrollable">
            <Flex direction='column' justify='flex-end' h='100%'>
                {messages.map((msg, idx, msgs) => {
                    if (idx === 0
                        || isDifferentDate(msgs[idx].sentAt, msgs[idx - 1].sentAt)
                        || isHeaderMessage(msgs, idx)) {
                        return <HeaderMessage message={msg} key={msg.key} />
                    }
                    else {
                        return <RegularMessage message={msg} key={msg.key} />
                    }


                })}
            </Flex>
            <div ref={scrollRef} className="scroll-to"></div>
        </Box>
    )
}


{/* <Message message={message} key={Math.ceil(Math.random() * Date.now())} /> */ }