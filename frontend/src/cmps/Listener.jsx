import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { socketService } from "../services/socket.service"
// import { toastifyService } from "../services/toastify.service"


export const Listener = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        console.log('listening...')
        socketService.on('update-user-status', updateUserStatus)

        return () => {
            socketService.off('update-user-status', updateUserStatus)
        }
    }, [])


    const updateUserStatus = (userInfo) => {
        console.log('userInfo:', userInfo)
        dispatch({ type: 'UPDATE_USER_STATUS', userInfo })
    }

    return <></>
}