import { createSlice } from '@reduxjs/toolkit'

export const audioSlice = createSlice({
  name: 'audio',
  initialState: {
    maxDuration:0
  },
  reducers: {
    setMaxDuration: (state, action) => {
        state.maxDuration = action.payload
    }
  }
})

export const { setMaxDuration } = audioSlice.actions

export default audioSlice.reducer