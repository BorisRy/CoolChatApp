import { Flex, Image, Text } from '@chakra-ui/react'
import { NavLink } from 'react-router-dom'

export const NewMsgToast = ({ message }) => {


    return (
        <NavLink to={`/chat/${message.chatId}`}>
            <Flex gap={4}>
                <Image src={message.author.avatar} boxSize='50px' objectFit='cover' />
                <Flex gap={2} direction='column'>
                    <Text as='b'>{message.author.alias}</Text>
                    <Text>{message.text}</Text>
                </Flex>
            </Flex>
        </NavLink>
    )
}