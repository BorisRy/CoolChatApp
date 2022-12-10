import { Card, CardBody, Avatar, VStack, HStack, Badge, Tag, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import { messageService } from '../../../services/message.service'


export const HeaderMessage = ({ message }) => {
    const { author } = message
    const { getTime } = messageService
    const { loggedInUser } = useSelector(state => state.userModule)

    const isUserAuthor = author._id === loggedInUser._id
    return (
        <Card w='100%' direction='row' size='sm' color='white' align='center' mt={4} _hover={{ background: 'whiteAlpha.100' }}>
            <Avatar src={author.avatar} size='md' mr={2} />
            <CardBody p={0}>
                <VStack spacing={1} align='flex-start'>
                    <HStack>
                        <Tag
                            colorScheme={isUserAuthor ? 'whatsapp' : 'whatsapp'}
                            size='md'
                            variant={isUserAuthor ? 'solid' : 'outline'}
                            fontSize='1rem'
                            _hover={{ background: 'green', cursor: 'pointer', color: 'white' }}
                        >
                            {author.alias}
                        </Tag>
                        <Text color='green.500' fontSize='xs'>{getTime(message.sentAt).getDatetimeStr()}</Text>
                    </HStack>
                    <Text noOfLines={[1, 2, 3]} overflowWrap='break-word'>{message.text}</Text>
                </VStack>
            </CardBody>
        </Card>
    )
}

export const RegularMessage = ({ message }) => {
    const { author } = message
    const { getTime } = messageService

    return (
        <Card w='100%' direction='row' size='sm' color='white' align='center' _hover={{ background: 'whiteAlpha.100' }}>
            <CardBody p={0}>
                <VStack spacing={1} align='flex-start'>
                    <HStack>
                        <Text fontSize='xs' ml={2} mr={3} color='green.500'>{getTime(message.sentAt).getTimeStr()}</Text>
                        <Text wordBreak={true}>{message.text}</Text>
                    </HStack>
                </VStack>
            </CardBody>
        </Card>
    )
}