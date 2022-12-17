import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Flex, useDisclosure } from "@chakra-ui/react"
import { SideBar } from "../cmps/chat-app/SideBar"
import { Search } from "../cmps/chat-app/Search"
import { loadChats } from "../store/chat/chat.actions"
import { Outlet } from "react-router-dom"
import { useMediaQuery } from '@chakra-ui/react'
import { Listener } from '../cmps/general/Listener'

export const ChatApp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.userModule)
    const { chats } = useSelector(state => state.chatModule)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')

    useEffect(() => {
        if (!loggedInUser) navigate('/')
        dispatch(loadChats(loggedInUser._id))
    }, [])

    if (!loggedInUser || !chats) return <></>
    return (
        <Flex minH='100%' w='100%' p={isLargerThan800 ? '1em' : '0'} color='white'>
            <Search isOpen={isOpen} onClose={onClose} />
            <SideBar onOpenDesktop={onOpen} />

            <Outlet />
            <Listener />
        </Flex>
    )
}