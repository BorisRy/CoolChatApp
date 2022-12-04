import { Flex } from "@chakra-ui/react"
import { Chat } from "./chat/Chat"

export const ChatWindow = () => {

    return (
        <Flex bg='gray.900' flex='1' m='0' >
            <Flex w={'100%'} direction='column'>
                <ChatNav />
                <Chat flex='1' />
            </Flex>
        </Flex>
    )
}

const ChatNav = () => {
    return (
        <Flex
            h={'50px'}
            borderBottom='1px'
            borderColor='green.700'
            w={'100%'}
            p={4}
        >
            nav
        </Flex>
    )
}