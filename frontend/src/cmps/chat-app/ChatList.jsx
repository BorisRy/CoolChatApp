import { useSelector } from "react-redux"
import { Stack, HStack, VStack, LinkOverlay } from '@chakra-ui/react'
import { NavLink } from "react-router-dom"
import { Flex, Text, Tag, Circle } from '@chakra-ui/react'
import { UserAvatar } from "./UserAvatar"

export const ChatList = () => {
    const { chats } = useSelector(state => state.chatModule)

    return (
        <VStack spacing={2} flex='1' bg='blackAlpha.700' align='flex-start'>
            {chats.map(chat => <ChatLink chat={chat} />)}
        </VStack>
    )
}

const ChatLink = ({ chat }) => {
    return (
        <NavLink className='chat-link' to={`${chat._id}`}>
            <Flex
                align='center'
                justify='space-between'
                maxW='100%'
                p={3}
                _hover={{ bg: 'whiteAlpha.100' }}
            >
                <Flex gap={4}>
                    <UserAvatar avatar={chat.with.avatar} status={chat.with.status} />
                    <Flex direction="column" justify='space-between'>
                        <Text>{chat.with.alias}</Text>
                        <Text noOfLines={1}>Last message goes herefffffffff</Text>
                    </Flex>
                </Flex>
                <Circle bg='green' size='20px'>1</Circle>
            </Flex>

        </NavLink>
    )
}