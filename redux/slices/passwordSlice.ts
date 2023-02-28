import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

interface PasswordState {
  password: string | null
}

const initialState: PasswordState = {
  password: null,
}

export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    changePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
      return state
    },
  },
})

export const { changePassword } = passwordSlice.actions

export const selectPassword = (state: RootState) => state.password.password

export default passwordSlice.reducer
