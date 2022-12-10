import { AvatarBadge } from "@chakra-ui/react"

export const UserStatus = ({ status }) => {

    const statusColor = status === 'online' ? 'green.500' : 'gray'
    return (
        <AvatarBadge boxSize='1em' bg={statusColor} />
    )
}