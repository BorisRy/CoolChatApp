import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Flex, Slide, useDisclosure } from "@chakra-ui/react"
import { useMediaQuery } from '@chakra-ui/react'
import { SideBar } from "../cmps/chat-app/SideBar"
import { ChatWindow } from "../cmps/chat-app/ChatWindow"
import { Search } from "../cmps/chat-app/Search"

export const ChatApp = () => {
    const navigate = useNavigate()
    const { loggedInUser } = useSelector(state => state.userModule)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isLargerThan800] = useMediaQuery('(min-width: 800px)')

    useEffect(() => {
        if (!loggedInUser) navigate('/')
    }, [])

    return (
        <Flex height='100vh' w='100%' p='1.5em' color='white'>
            <Search isOpen={isOpen} onClose={onClose} />
            <SideBar onOpen={onOpen} />
            <ChatWindow />
        </Flex>
    )
}