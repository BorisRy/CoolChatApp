import { useEffect, useRef } from "react"
import { Flex, Box } from "@chakra-ui/react"
import { HeaderMessage, RegularMessage, MessageSkeleton } from "./Message"
import { messageService } from "../../../services/message.service"

export const MessageLog = ({ messages, isLoading }) => {
    const scrollRef = useRef(null)


    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const isHeaderMessage = (arr, idx) => {
        const isDifferentAuthor = arr[idx].author._id !== arr[idx - 1].author._id
        const didThreeMinutesPass = messageService.getTimeDiff(arr[idx].sentAt, arr[idx - 1].sentAt).mins >= 3
        return isDifferentAuthor || didThreeMinutesPass
    }

    const isDifferentDate = (timestamp1, timestamp2) => {
        return messageService.isDifferentDate(timestamp1, timestamp2)
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <Box className="scrollable" px={4} pb={2}>
            {!isLoading ?
                messages.map((msg, idx, msgs) => {
                    if (idx === 0
                        || isDifferentDate(msgs[idx].sentAt, msgs[idx - 1].sentAt)
                        || isHeaderMessage(msgs, idx)) {
                        return <HeaderMessage message={msg} key={msg.key} />
                    }
                    else {
                        return <RegularMessage message={msg} key={msg.key} />
                    }
                })
                :
                Array(20).fill(1).map((msg, idx) => <MessageSkeleton key={idx} />)
            }
            <div ref={scrollRef} className="scroll-to"></div>
        </Box>
    )
}
