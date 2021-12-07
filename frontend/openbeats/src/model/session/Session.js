import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    "sessionId": "",
    "sessionName": "",
    "participants":[],
    "bucketName":"",
    "audioTracks":[],
  },
  reducers: {
    setSession: (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.sessionName = action.payload.sessionName;
        state.participants = action.payload.participants;
        state.bucketName = action.payload.bucketName;
    },
    setSessionId: (state, action) => {
        state.sessionId = action.payload
    },
    setSessionName: (state, action) => {
        state.sessionName = action.payload
    },
    setParticipants: (state, action) => {
        state.participants = action.payload
    },
    setBucketName: (state, action) => {
      state.bucketName = action.payload
    },
    setAudioTracks: (state, action) => {
      state.audioTracks = action.payload
    }
  }
})

export const { setSession, setSessionId, setSessionName, setParticipants, setBucketName, setAudioTracks } = sessionSlice.actions

export default sessionSlice.reducer