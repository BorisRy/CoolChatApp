import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Flex, useDisclosure } from "@chakra-ui/react"
import { SideBar } from "../cmps/chat-app/SideBar"
import { Search } from "../cmps/chat-app/Search"
import { loadChats } from "../store/chat/chat.actions"
import { Outlet } from "react-router-dom"
import { Listener } from "../cmps/Listener"

export const ChatApp = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loggedInUser } = useSelector(state => state.userModule)
    const { chats } = useSelector(state => state.chatModule)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (!loggedInUser) navigate('/')
        dispatch(loadChats(loggedInUser._id))
    }, [])

    if (!loggedInUser || !chats) return <></>
    return (
        <Flex height='100vh' w='100%' p='1.5em' color='white'>
            <Search isOpen={isOpen} onClose={onClose} />
            <SideBar onOpen={onOpen} />
            <Outlet />
            <Listener />
        </Flex>
    )
}