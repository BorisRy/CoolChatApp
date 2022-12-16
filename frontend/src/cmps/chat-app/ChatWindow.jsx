import { Flex, Text, Avatar, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Chat } from "./chat/Chat"
import { socketService } from "../../services/socket.service"
import { TypingIndicator } from "../TypingIndicator"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useMediaQuery } from '@chakra-ui/react'

export const ChatWindow = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [currentChat, setCurrentChat] = useState(null)
    const { chats } = useSelector(state => state.chatModule)

    useEffect(() => {
        if (!chats) navigate('/chat')
        const currChat = chats?.find(chat => chat._id === params.chatId)
        setCurrentChat(currChat)
        socketService.emit('set-chat-room', params.chatId)
    }, [])

    useEffect(() => {
        if (params.chatId) {
            const currChat = chats?.find(chat => chat._id === params.chatId)
            setCurrentChat(currChat)
            socketService.emit('set-chat-room', params.chatId)
        }
    }, [params.chatId, chats])

    if (!currentChat) return <>Loading</>
    return (
        <Flex bg='gray.800' flex='1' m='0' h='100%' maxH='100%'>
            <Flex w={'100%'} direction='column' h='100%'>
                <ChatNav currentChat={currentChat} />
                <Chat currentChat={currentChat} />
            </Flex>
        </Flex>
    )
}

const ChatNav = ({ currentChat }) => {
    const navigate = useNavigate()
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')

    const onGoBack = () => {
        navigate('/chat')
    }

    if (!currentChat) return <></>

    return (
        <Flex
            flexBasis={'50px'}
            flex={0}
            maxH={'50px'}
            borderBottom='1px'
            borderColor='green.700'
            w={'100%'}
            p={4}
        >
            <Flex align='center' justify='space-between' maxW='100%' gap={2} color='white'>
                {isLargerThan800 ? <Avatar src={currentChat.with.avatar} size='md'></Avatar> : (
                    <Box position='relative' onClick={onGoBack}>
                        <ArrowBackIcon position='absolute' left='-15px' top='50%' transform='translateY(-50%)' />
                        <Avatar src={currentChat.with.avatar} size='md'></Avatar>
                    </Box>
                )}


                <Flex gap={4}>
                    <Flex direction="column" justify='space-between'>
                        <Text size='md' as='b'>{currentChat.with.alias}</Text>
                        {currentChat.with.typing ?
                            <TypingIndicator />
                            :
                            <Text noOfLines={1} fontSize='md'>{currentChat.with.status}</Text>
                        }

                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}