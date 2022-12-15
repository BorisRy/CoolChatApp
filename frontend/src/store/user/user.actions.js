import { userService } from "../../services/user.service"
import { socketService } from "../../services/socket.service"

export function login(userToLogin) {
    return async (dispatch) => {
        try {
            const user = await userService.login(userToLogin)
            if (!user) return user
            dispatch({ type: 'LOGIN_USER', user })
            socketService.login(user._id)
            return user
        } catch (error) {
            return error
        }

    }
}

export function signup(credentials) {
    return async (dispatch) => {
        try {
            const user = await userService.signup(credentials)
            dispatch({ type: 'LOGIN_USER', user })
            socketService.login(user._id)
            return user
        } catch (error) {
            return error
        }

    }
}

export function logout(userId) {
    return async (dispatch) => {
        try {
            socketService.logout()
            dispatch({ type: 'LOGOUT_USER' })
            dispatch({ type: 'USER_LOGOUT' })
            await userService.logout(userId)
        }
        catch (err) {
            return err
        }
    }
}
