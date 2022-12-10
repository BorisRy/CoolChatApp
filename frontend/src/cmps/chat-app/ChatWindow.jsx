import { Flex, Text, Avatar } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Chat } from "./chat/Chat"
import { socketService } from "../../services/socket.service"

export const ChatWindow = () => {
    const params = useParams()
    const [currentChat, setCurrentChat] = useState(null)
    const { chats } = useSelector(state => state.chatModule)

    useEffect(() => {
        const currChat = chats.find(chat => chat._id === params.chatId)
        setCurrentChat(currChat)
    }, [])

    useEffect(() => {
        if (params.chatId) {
            const currChat = chats.find(chat => chat._id === params.chatId)
            setCurrentChat(currChat)
            socketService.emit('set-chat-room', params.chatId)
        }
    }, [params.chatId])

    return (
        <Flex bg='gray.900' flex='1' m='0' h='100%'>
            <Flex w={'100%'} direction='column' h='100%'>
                <ChatNav currentChat={currentChat} />
                <Chat currentChat={currentChat} />
            </Flex>
        </Flex>
    )
}

const ChatNav = ({ currentChat }) => {




    if (!currentChat) return <></>

    return (
        <Flex
            h={'50px'}
            borderBottom='1px'
            borderColor='green.700'
            w={'100%'}
            p={4}
        >
            <Flex align='center' justify='space-between' maxW='100%' gap={2}>
                <Avatar src={currentChat.with.avatar} size='md'></Avatar>
                <Flex gap={4}>
                    <Flex direction="column" justify='space-between'>
                        <Text>{currentChat.with.alias}</Text>
                        <Text noOfLines={1}>{currentChat.with.status}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}