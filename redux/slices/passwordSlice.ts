import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface PasswordState {
  password: string | null
  tries: number
  banned: string | null
}

const initialState: PasswordState = {
  password: null,
  tries: 0,
  banned: null,
}

export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    changePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
      return state
    },
    addTries: (state, action: PayloadAction<number>) => {
      state.tries += action.payload
      return state
    },
    resetTries: (state) => {
      state.tries = 0
      return state
    },
    setBannedTime: (state, action: PayloadAction<string | null>) => {
      state.banned = action.payload
      return state
    },
  },
})

export const { changePassword, addTries, resetTries, setBannedTime } =
  passwordSlice.actions

export const selectPassword = (state: RootState) => state.password.password
export const selectNumberOfTries = (state: RootState) => state.password.tries
export const selectBanned = (state: RootState) =>
  !!state.password.banned ? new Date(state.password.banned) : null

export default passwordSlice.reducer
