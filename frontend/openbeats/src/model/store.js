import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/User'

export default configureStore({
  reducer: {
      user: userReducer
  }
})