import { Avatar } from "@chakra-ui/react"
import { UserStatus } from "./UserStatus"

export const UserAvatar = ({ avatar, status }) => {
    return (
        <Avatar src={avatar}>
            <UserStatus status={status} />
        </Avatar>
    )
}