import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/User'
import audioReducer from './audio/Audio'

export default configureStore({
  reducer: {
      user: userReducer,
      audio: audioReducer
  }
})