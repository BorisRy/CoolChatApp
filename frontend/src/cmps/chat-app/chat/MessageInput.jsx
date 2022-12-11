import { Input, InputGroup, InputLeftAddon, InputRightAddon, Icon, Tooltip, IconButton } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"
import { IoMdSend } from 'react-icons/io'
import { BsFillEmojiLaughingFill } from 'react-icons/bs'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { messageService } from "../../../services/message.service"
import { socketService } from "../../../services/socket.service"
import { useParams } from "react-router-dom"


export const MessageInput = ({ addMessage }) => {

    const params = useParams()
    const [messageText, setMessageText] = useState('')
    const { loggedInUser } = useSelector(state => state.userModule)

    const handleChange = ({ target }) => {
        setMessageText(target.value)
    }

    const onSendMessage = (event) => {
        event.preventDefault()
        if (messageText === '') return
        const message = messageService.createMessage(messageText, loggedInUser)
        message.chatId = params.chatId
        socketService.emit('chat-send-message', message)
        addMessage(message)
        setMessageText('')
    }

    return (
        <form onSubmit={onSendMessage} className={'message-input'}>
            <InputGroup h='60px' align='center' size='md' flex={0}>

                <InputLeftAddon bg='gray.700'>
                    <Tooltip label='Attach an image' placement="top">
                        <AttachmentIcon _hover={{ cursor: 'pointer', color: 'green.300' }} />
                    </Tooltip>
                </InputLeftAddon>

                <Input
                    bg='blackAlpha.100'
                    _focusVisible={false}
                    placeholder='custom placeholder'
                    _placeholder={{ opacity: 0.6, color: 'green.300' }}
                    value={messageText}
                    onChange={handleChange}
                />

                <InputRightAddon bg='gray.700'>
                    <Icon as={BsFillEmojiLaughingFill} mr={4} _hover={{ cursor: 'pointer', color: 'green.300' }} />
                    <IconButton
                        bg='none'
                        _hover='none'
                        type="submit"
                        icon={<Icon as={IoMdSend}
                            _hover={{ cursor: 'pointer', color: 'green.300' }} />}></IconButton>
                </InputRightAddon>
            </InputGroup>
        </form>

    )
}