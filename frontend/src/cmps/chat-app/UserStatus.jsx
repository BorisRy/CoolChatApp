import { Circle, color } from "@chakra-ui/react"

export const UserStatus = ({ status }) => {

    const statusColor = status === 'online' ? '#0fa' : 'gray'
    return (
        <Circle size='16px' bgColor='inherit' pos='absolute' bottom={2} right={2} >
            <Circle size='12px' bg={statusColor}></Circle>
        </Circle >
    )
}