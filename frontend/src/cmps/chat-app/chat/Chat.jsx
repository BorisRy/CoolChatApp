import { Flex, Input, InputGroup, InputLeftAddon, InputRightAddon, Icon, Tooltip } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"
import { IoMdSend } from 'react-icons/io'
import { BsFillEmojiLaughingFill } from 'react-icons/bs'
export const Chat = () => {

    return (
        <Flex direction={'column'} px={4} h='100%'>
            <MessageLog />
            <MessageInput />
        </Flex>
    )
}

const MessageLog = () => {

    return (
        <Flex direction='column' flex='1'>Message Log</Flex>
    )
}

const MessageInput = () => {

    return (
        <InputGroup h='60px' align='center' size='md' >
            <InputLeftAddon bg='gray.700'>
                <Tooltip label='Attach an image' placement="top">
                    <AttachmentIcon _hover={{ cursor: 'pointer', color: 'green.300' }} />
                </Tooltip>
            </InputLeftAddon>
            <Input bg='blackAlpha.100' focusBorderColor='green.300' />
            <InputRightAddon bg='gray.700'>
                <Icon as={BsFillEmojiLaughingFill} mr={4} _hover={{ cursor: 'pointer', color: 'green.300' }} />
                <Icon as={IoMdSend} _hover={{ cursor: 'pointer', color: 'green.300' }} />
            </InputRightAddon>
        </InputGroup>
    )
}

const InputIcon = ({ icon, label }) => {

    return (
        <Tooltip label={label} placement="top">
            {icon}
        </Tooltip>
    )
}