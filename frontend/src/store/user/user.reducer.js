import {userService} from '../../services/user.service'

const initialState = {
    loggedInUser: userService.getLoggedInUser()
}

export function userReducer(state = initialState, action = {}){
    switch (action.type) {
        case 'LOGIN_USER':
            return {...state, loggedInUser: action.user}
        case 'LOGOUT_USER':
            return { ...state, loggedInUser: null }
        default: return { ...state }
    }
}