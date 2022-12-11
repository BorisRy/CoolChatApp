import { useSelector } from "react-redux"
import { VStack, Icon } from '@chakra-ui/react'
import { NavLink } from "react-router-dom"
import { Flex, Text, Circle } from '@chakra-ui/react'
import { UserAvatar } from "./UserAvatar"
import { BsArrowDownLeft, BsArrowUpRight } from 'react-icons/bs'

export const ChatList = () => {
    const { chats } = useSelector(state => state.chatModule)

    return (
        <VStack spacing={1} flex='1' bg='blackAlpha.700' align='flex-start'>
            {chats.sort((c1, c2) => c2.lastMessage.sentAt - c1.lastMessage.sentAt).map(chat => <ChatLink chat={chat} />)}
        </VStack>
    )
}

const ChatLink = ({ chat }) => {
    const { loggedInUser } = useSelector(state => state.userModule)
    return (
        <NavLink className='chat-link' to={`${chat._id}`}>
            <Flex
                align='center'
                justify='space-between'
                maxW='100%'
                p={2}
                _hover={{ bg: 'whiteAlpha.100' }}
                borderLeft={chat.unread > 0 ? '2px solid green' : '2px solid transparent'}
            >
                <Flex gap={4}>
                    <UserAvatar avatar={chat.with.avatar} status={chat.with.status} />
                    <Flex direction="column" justify='space-between'>
                        <Text fontSize='lg' as={chat.unread > 0 && 'b'}>{chat.with.alias}</Text>
                        <Flex align='center' gap={2}>
                            {chat.lastMessage?.author?._id === loggedInUser._id ?
                                <Icon boxSize={4} as={BsArrowUpRight} color='green.200' />
                                :
                                <Icon boxSize={4} as={BsArrowDownLeft} color='green.200' />
                            }
                            <Text noOfLines={1} color='gray.300'>
                                {chat.lastMessage?.text}
                            </Text>
                        </Flex>

                    </Flex>
                </Flex>
                {chat.unread > 0 && <Circle bg='green' size='20px'>{chat.unread}</Circle>}
            </Flex>

        </NavLink>
    )
}