import { createSlice } from '@reduxjs/toolkit'

export const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    "sessionId": "NA",
    "sessionName": "NA",
    "participants":[]
  },
  reducers: {
    setSession: (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.sessionName = action.payload.sessionName;
        state.participants = action.payload.participants;
    },
    setSessionId: (state, action) => {
        state.sessionId = action.payload
    },
    setSessionName: (state, action) => {
        state.sessionName = action.payload
    },
    setParticipants: (state, action) => {
        state.participants = action.payload
    }
  }
})

export const { setSession, setSessionId, setSessionName, setParticipants } = sessionSlice.actions

export default sessionSlice.reducer