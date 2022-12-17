import { TypingIndicator } from "../TypingIndicator"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useMediaQuery } from '@chakra-ui/react'
import { Flex, Text, Avatar, Box, GridItem } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"

export const ChatNav = ({ currentChat }) => {
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