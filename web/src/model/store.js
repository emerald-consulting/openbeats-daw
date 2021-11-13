import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/User'
import audioReducer from './audio/Audio'
import sessionReducer from './session/Session'

export default configureStore({
  reducer: {
      user: userReducer,
      audio: audioReducer,
      session: sessionReducer
  }
})