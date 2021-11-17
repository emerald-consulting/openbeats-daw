import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    "userid":13,
    "username":"",
    "password":"$2a$10$JPiZveE9IowoPsrQSyky5ec928qQhpR2xZbne1JqE4iJXouTP0oEe",
    "firstName":"testName",
    "lastName":"L",
    "preferredName":"testName",
    "emailId":"nidic54688@proxiesblog.com",
    "subscriptionType":"free",
    "emailVerified":true,
    "authorities":null,
    "enabled":true,
    "accountNonLocked":true,
    "accountNonExpired":true,
    "credentialsNonExpired":true
  },
  reducers: {
    loadUser: (state, action) => {
        state = action.payload
    },
    setUserEmail: (state, action) => {
        state.emailId = action.payload
    },
    setUserPassword: (state, action) => {
      state.password = action.payload
    },
    setUserToken: (state, action) => {
          state.jwtToken = action.payload
    }
  }
})

export const { loadUser, setUserEmail, setUserPassword,setUserToken } = userSlice.actions

export default userSlice.reducer