import { Flex, Container, VStack, Avatar, Icon, Text, Tooltip, Box } from "@chakra-ui/react"
import { useSelector } from "react-redux"
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { BsChatQuoteFill } from 'react-icons/bs'
import { UserStatus } from "./UserStatus"

export const SideBar = ({ onOpen }) => {
    return (
        <Flex bg='gray.600' flexBasis='250px' mr='1.5em' direction='column'>
            <SearchBar onOpen={onOpen} />
            <VStack flex='1' bg='blackAlpha.700'>
                <Container>BObo</Container>
                <Container>Meemu</Container>
            </VStack>
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

    return (
        <Flex bg='blackAlpha.800' p='4px 8px' justify='space-between'>
            <Flex>
                <Box pos='relative'>
                    <Avatar src={loggedInUser.avatar} size='md' mr={1} />
                    <UserStatus status={loggedInUser.status} />
                </Box>
                <Flex direction='column'>
                    <Text fontSize='md'>{loggedInUser.alias}</Text>
                    <Text fontSize='xs'>{loggedInUser.tag}</Text>
                </Flex>
            </Flex>
            <Flex align='center'>
                <Tooltip label='Log out' fontSize='md' >
                    <span>
                        <Icon as={RiLogoutCircleRLine} boxSize={6} color='green.300' _hover={{ cursor: 'pointer', color: 'green.200' }} />
                    </span>
                </Tooltip>
            </Flex>
        </Flex>
    )
}