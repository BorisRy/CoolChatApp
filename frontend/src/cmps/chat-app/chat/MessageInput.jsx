import { Input, InputGroup, InputLeftAddon, InputRightAddon, Icon, Tooltip, IconButton, Box } from "@chakra-ui/react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react'
import { AttachmentIcon } from "@chakra-ui/icons"
import { IoMdSend } from 'react-icons/io'
import { BsFillEmojiLaughingFill } from 'react-icons/bs'
import { useState, useRef } from "react"
import { useSelector } from "react-redux"
import { messageService } from "../../../services/message.service"
import { socketService } from "../../../services/socket.service"
import { useParams } from "react-router-dom"
import EmojiPicker from 'emoji-picker-react'
import { debounce } from 'lodash';

export const MessageInput = ({ addMessage }) => {
    const params = useParams()
    const setTyping = (isTyping) => socketService.emit('is-user-typing', {
        user: loggedInUser._id,
        chatId: params.chatId,
        isTyping
    })
    const setTypingTrue = useRef(debounce(() => setTyping(true), 1000, { leading: true, trailing: false }))
    const setTypingFalse = useRef(debounce(() => setTyping(false), 2500, { leading: false, trailing: true }))

    const [messageText, setMessageText] = useState('')
    const { loggedInUser } = useSelector(state => state.userModule)

    const handleChange = ({ target }) => {
        setMessageText(target.value)
        setTypingTrue.current()
        setTypingFalse.current()
    }

    const handleEmoji = ({ emoji }) => {
        setMessageText(prevText => prevText + emoji)
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
            <InputGroup h='60px' align='center' size='md' flex={0} color='white'>
                {/* <InputLeftAddon bg='gray.700'>
                    <Tooltip label='Attach an image' placement="top">
                        <AttachmentIcon _hover={{ cursor: 'pointer', color: 'green.300' }} />
                    </Tooltip>
                </InputLeftAddon> */}

                <Input
                    bg='blackAlpha.100'
                    _focusVisible={false}
                    placeholder='custom placeholder'
                    _placeholder={{ opacity: 0.6, color: 'green.300' }}
                    value={messageText}
                    onChange={handleChange}
                />

                <InputRightAddon bg='gray.700' p={0}>
                    <Popover placement='top-start' bg='none'>
                        {({ isOpen, onClose }) => (
                            <>
                                <PopoverTrigger>
                                    <IconButton
                                        icon={<BsFillEmojiLaughingFill />}
                                        _hover={{ cursor: 'pointer', color: 'green.300' }}
                                        variant='outline'
                                        border='none'
                                    />
                                </PopoverTrigger>
                                <PopoverContent bg='transparent' border='none'>
                                    {isOpen && <EmojiPicker emojiVersion="0.6" width={250} theme="dark" onEmojiClick={handleEmoji} skinTonesDisabled={true} />}
                                </PopoverContent>
                            </>
                        )}
                    </Popover>

                    <IconButton
                        bg='none'
                        _hover='none'
                        type="submit"
                        icon={<Icon as={IoMdSend}
                            _hover={{ cursor: 'pointer', color: 'green.300' }} />} />
                </InputRightAddon>
            </InputGroup>
        </form>

    )
}