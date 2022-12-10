import {
    Tag,
    Text,
    Flex,
    Icon,
    IconButton,
    Tooltip,
    Input,
    Drawer,
    VStack,
    HStack,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'
import { TbHash } from 'react-icons/tb'
import { BsChatQuoteFill } from 'react-icons/bs'
import { useState } from 'react'
import { useEffect } from 'react'
import { debounce } from 'lodash'
import { useRef } from 'react'
import { userService } from '../../services/user.service'
import { UserAvatar } from './UserAvatar'
import { useSelector } from 'react-redux'
import { chatService } from '../../services/chat.service'
import { useNavigate } from 'react-router-dom'


export function Search({ isOpen, onClose }) {
    const navigate = useNavigate()
    const debouncedQuery = useRef(debounce(query, 1000))
    const [queryParams, setQueryParams] = useState({ email: '', tag: '', alias: '' })
    const { loggedInUser } = useSelector(state => state.userModule)
    const [users, setUsers] = useState([])

    const handleChange = ({ target }) => {
        const field = target.name
        const value = target.value

        setQueryParams(prevParams => ({ ...prevParams, [field]: value }))
    }

    useEffect(() => {
        const { alias, tag, email } = queryParams
        if (alias || tag || email) {
            debouncedQuery.current(queryParams)
        } else {
            setUsers([])
        }
    }, [queryParams])


    async function startChat(withUser) {
        const chat = chatService.createChat(false, loggedInUser, withUser)
        try {
            const newChat = await chatService.addChat(chat)
            navigate(`${newChat._id}`)

        } catch (error) {

        }
    }

    async function query(values) {
        try {
            const users = await userService.query(values)

            setUsers(users)
        } catch (error) {
            console.log('error:', error)
        }
    }

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}

            >
                <DrawerOverlay />
                <DrawerContent color='white' bg='gray.800' borderLeft='1px' borderLeftColor='green'>
                    <DrawerCloseButton />
                    <DrawerHeader>Look for friends</DrawerHeader>

                    <DrawerBody>
                        <VStack>
                            <Input
                                placeholder="Email..."
                                _placeholder={{ color: 'green.300', opacity: 0.6 }}
                                focusBorderColor='lime'
                                value={queryParams.email}
                                name='email'
                                onChange={handleChange} />
                            <HStack>
                                <Input
                                    placeholder='Alias...'
                                    _placeholder={{ color: 'green.300', opacity: 0.6 }}
                                    focusBorderColor='lime'
                                    value={queryParams.alias}
                                    name='alias'
                                    onChange={handleChange} />
                                <Icon as={TbHash} color='green.300' />
                                <Input
                                    placeholder='Tag...'
                                    _placeholder={{ color: 'green.300', opacity: 0.6 }}
                                    focusBorderColor='lime'
                                    value={queryParams.tag}
                                    name='tag'
                                    onChange={handleChange} />
                            </HStack>
                        </VStack>

                        <div>{users
                            .filter(user => user._id !== loggedInUser._id)
                            .map(user => <UserPreview user={user} startChat={startChat} />)}</div>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}


const UserPreview = ({ user, startChat }) => {


    return (
        <Tooltip label={`Start a conversation with ${user.alias}`}>
            <Flex
                justify='space-between'
                userSelect='none'
                opacity='0.7'
                p={2}
                _hover={{ opacity: 1, bg: 'whiteAlpha.200', cursor: 'pointer' }}
                onClick={() => startChat(user)}
            >
                <Flex gap={2}>
                    <UserAvatar avatar={user.avatar} status={user.status} />
                    <HStack spacing={1} align='center'>
                        <Tag colorScheme='green' variant='outline'>{user.alias}</Tag>
                        <Text color='green.500' fontWeight='bold'>{user.tag}</Text>
                    </HStack>
                </Flex>
                <IconButton
                    icon={<BsChatQuoteFill />}
                    colorScheme='green'
                    variant='outline' />
            </Flex>
        </Tooltip>

    )
}