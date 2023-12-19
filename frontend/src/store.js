import { createStore, combineReducers, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'

// Import individual reducers from the 'userReducers' file
import {
    userLoginReducer,         // Reducer for user login
    userRegisterReducer,      // Reducer for user registration
    userDetailsReducer,       // Reducer for fetching user details
    userUpdateReducer         // Reducer for updating user information
} from './reducers/userReducers'

// Combine individual reducers into a root reducer
const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdate: userUpdateReducer,
})

// Retrieve user information from local storage, if available
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

// Set initial state for the Redux store, including user login information from local storage
const initialState = {
    userLogin: { userInfo: userInfoFromStorage }
}

// Define middleware to be applied to the store, including the 'thunk' middleware for handling asynchronous actions
const middleware = [thunk]

// Create the Redux store using the root reducer, initial state, and middleware
const store = createStore(reducer, initialState, applyMiddleware(...middleware))

// Export the configured Redux store for use in the application
export default store