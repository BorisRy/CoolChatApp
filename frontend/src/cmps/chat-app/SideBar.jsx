import { Flex, Container, VStack, Avatar, Icon, Text, Tooltip, Box, AvatarBadge, Tag } from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { BsChatQuoteFill } from 'react-icons/bs'
import { logout } from "../../store/user/user.actions"
import { useNavigate } from "react-router-dom"
import { ChatList } from "./ChatList"

export const SideBar = ({ onOpen }) => {
    return (
        <Flex bg='gray.600' flexBasis='250px' minW='250px' mr='1.5em' direction='column'>
            <SearchBar onOpen={onOpen} />
            <ChatList />
            <UserDetails />
        </Flex>
    )
}

const SearchBar = ({ onOpen }) => {

    return (
        <Flex
            align={'center'}
            onClick={onOpen}
            bg='blackAlpha.800'
            borderBottom='1px' borderColor='green.700'
            color='green.300'
            minH={'50px'}
            p={3}
            px={4}
            _hover={{ color: 'green.200', cursor: 'pointer', background: 'blackAlpha.900' }}>
            <Text mr={2}>Find or start a conversation</Text>
            <Icon as={BsChatQuoteFill} boxSize={4} />
        </Flex>)
}

const UserDetails = () => {
    const { loggedInUser } = useSelector(state => state.userModule)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onLogout = () => {
        dispatch(logout(loggedInUser._id))
        navigate('/')
    }

    return (
        <Flex bg='blackAlpha.800' p='4px 8px' justify='space-between'>
            <Flex>
                <Box py={1} mr={4}>
                    <Avatar src={loggedInUser.avatar}>
                        <AvatarBadge boxSize='1em' bg='green.500' />
                    </Avatar>
                </Box>
                <Flex direction='column' justify='space-evenly'>
                    <Tag variant='outline' colorScheme='green'>
                        {loggedInUser.alias}
                    </Tag>
                    <Text fontSize='xs'>{loggedInUser.tag}</Text>
                </Flex>
            </Flex>
            <Flex align='center'>
                <Tooltip label='Log out' fontSize='md' >
                    <span onClick={onLogout}>
                        <Icon as={RiLogoutCircleRLine} boxSize={6} color='green.300' _hover={{ cursor: 'pointer', color: 'green.200' }} />
                    </span>
                </Tooltip>
            </Flex>
        </Flex>
    )
}