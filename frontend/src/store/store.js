import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import thunk from 'redux-thunk'
import { userReducer } from './user/user.reducer'
import { chatReducer } from './chat/chat.reducer'


const appReducer = combineReducers({
    userModule: userReducer,
    chatModule: chatReducer
})

const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        return appReducer(undefined, action)
    }

    return appReducer(state, action)
}


const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(rootReducer,
    composeEnhancers(applyMiddleware(thunk)))


// For debug only!
// store.subscribe(() => {
//     console.log('Store state is:', store.getState())
// })