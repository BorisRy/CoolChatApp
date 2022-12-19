import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { Heading, IconButton, Icon, Tooltip, VStack, HStack, Button, Avatar, Text } from "@chakra-ui/react"
import { Input, useDisclosure } from "@chakra-ui/react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
} from '@chakra-ui/react'
import {
    Tag,
    TagLabel,
} from '@chakra-ui/react'
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
import { userService } from '../../services/user.service'
import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { chatService } from "../../services/chat.service"
import { addChat } from "../../store/chat/chat.actions"

export const CreateGroupModal = ({ currentChat = null }) => {
    const dispatch = useDispatch()
    const [users, setUsers] = useState([])
    const [selected, setSelected] = useState([])
    const [groupName, setGroupname] = useState('')
    const { loggedInUser } = useSelector(state => state.userModule)
    const { isOpen, onToggle, onClose } = useDisclosure()

    useEffect(() => {
        return () => {
            setUsers([])
            setSelected([])
            setGroupname('')
        }
    }, [])

    useEffect(() => {
        query()
    }, [currentChat])

    async function query() {
        try {
            // Fetch all users
            var users = await userService.query()

            // if this is clicked in a private chat, add the user to selected
            if (currentChat && !currentChat.isGroup) {
                const user = users.find(user => user._id === currentChat.with._id)
                setSelected([user])
            }

            // remove the logged in user and everyone in the chat from the list
            users = users.filter(user => {
                if (!currentChat) {
                    return user._id !== loggedInUser._id
                } else if (!currentChat.isGroup) {
                    return user._id !== loggedInUser._id && user._id !== currentChat?.with._id
                } else {
                    let participants = currentChat.participants.map(participant => participant._id)
                    return !participants.includes(user._id)
                }
            })
            setUsers(users)
        } catch (error) {
            console.log('error:', error)
        }
    }

    function handleCheck({ target }) {
        const isUserSelected = selected.some(user => user._id === target.value)
        if (isUserSelected) {
            setSelected(prevSelected => prevSelected.filter(user => user._id !== target.value))
        } else {
            const checkedUser = users.find(user => user._id === target.value)
            setSelected(prevSelected => [...prevSelected, checkedUser])
        }
    }

    function onCreateGroup() {
        onClose()
        const groupMembers = [...selected, loggedInUser]
        const group = chatService.createChat(true, ...groupMembers)
        group.groupName = groupName
        dispatch(addChat(group))
    }

    async function onAddToGroup() {
        let users = [...selected]
        onClose()
        await chatService.addToGroupChat(currentChat._id, users)
    }

    function handleChange({ target }) {
        setGroupname(prevName => target.value)
    }

    function onOpenPopover() {
        if (!currentChat || currentChat && currentChat.isGroup) {
            setSelected([])
        } else if (currentChat && !currentChat.isGroup) {
            setSelected(prevSelected => [prevSelected[0]])
        }
        setGroupname('')
        onToggle()
    }



    let tooltipLabel
    if (currentChat.isGroup) {
        tooltipLabel = 'Add people to group'
    } else {
        tooltipLabel = currentChat ? `Start a group chat with ${currentChat.with.alias}` : 'Start a group chat'
    }

    return (
        <Popover
            placement="bottom-end"
            isOpen={isOpen}
            onClose={onClose}
        >

            <PopoverTrigger>
                <span>
                    <Tooltip label={tooltipLabel}>
                        <IconButton
                            icon={<Icon as={AiOutlineUsergroupAdd} boxSize={6} />}
                            variant='outline'
                            colorScheme={'green'}
                            onClick={onOpenPopover}
                        />
                    </Tooltip>
                </span>
            </PopoverTrigger>

            {isOpen && <PopoverContent bg='gray.800'>
                <PopoverArrow bg='gray.800' />
                <PopoverCloseButton />
                <PopoverHeader>
                    <Heading fontSize='md'>{currentChat.isGroup ? 'Add to group' : 'Create Group Chat'}</Heading>
                    {!currentChat.isGroup && <Text fontSize='sm'>Select at least 2 users</Text>}
                    {!currentChat.isGroup && <Input placeholder="Group name" mt={2} value={groupName} onChange={handleChange} />}
                </PopoverHeader>


                <PopoverBody h='100px' maxH='100px' overflow='hidden' overflowY='auto'>
                    <CheckboxGroup colorScheme='green'>
                        <VStack align='start'>
                            {users.map(user => (
                                <Checkbox value={user._id} onChange={handleCheck} key={user._id} isChecked={false}>
                                    <UserTag user={user} isSelected={false} />
                                </Checkbox>
                            ))}
                        </VStack>
                    </CheckboxGroup>
                </PopoverBody>
                <PopoverFooter>
                    <HStack align='start' h='100px' maxH='100px' overflow='hidden' overflowY='auto'>
                        {selected.map(user => (
                            <UserTag user={user} isSelected={true} key={user._id} />
                        ))}
                    </HStack>
                    <Button
                        ml='auto'
                        colorScheme='green'
                        isDisabled={(selected.length < 2 || !groupName) && !currentChat.isGroup}
                        onClick={currentChat.isGroup ? onAddToGroup : onCreateGroup}
                    >
                        {currentChat.isGroup ? 'Add to group' : 'Create Group Chat'}
                    </Button>
                </PopoverFooter>
            </PopoverContent>}
        </Popover>
    )

}

const UserTag = ({ user, isSelected }) => (
    <Tag size='lg' colorScheme={isSelected ? 'green' : 'black'} borderRadius='full'>
        <Avatar
            src={user.avatar}
            size='xs'
            name={user.alias}
            ml={-1}
            mr={2}
        />
        <TagLabel>{user.alias + user.tag}</TagLabel>
    </Tag>
)