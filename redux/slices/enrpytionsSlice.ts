import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface EncrpytState {
  id: string
  user: string
  name: string
  value: string
}

const initialState: EncrpytState[] = []

export const encrpytSlice = createSlice({
  name: 'encryptValues',
  initialState,
  reducers: {
    addEncrypt: (state, action: PayloadAction<EncrpytState>) => {
      state = [...state, action.payload]
      return state
    },
    encryptRemoveById: (state, action: PayloadAction<string>) => {
      state = state.filter((v) => v.id !== action.payload)
      return state
    },
    encryptUpdate: (
      state,
      action: PayloadAction<{
        id: string
        user?: string
        name?: string
        value?: string
      }>
    ) => {
      const { id, name, user, value } = action.payload

      state = state.map((v) => {
        if (v.id !== id) return v
        return {
          ...v,
          user: user ?? v.user,
          name: name ?? v.name,
          value: value ?? v.value,
        }
      })

      return state
    },
  },
})

export const { addEncrypt, encryptRemoveById, encryptUpdate } =
  encrpytSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEncrypt = (state: RootState) => state.encryptValues
export const selectEncryptById = (state: RootState, id: string) =>
  state.encryptValues.find((v) => v.id === id)

export default encrpytSlice.reducer
