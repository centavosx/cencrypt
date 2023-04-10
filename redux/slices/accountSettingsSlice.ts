import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface AccountSettings {
  autoSync: boolean | string | null
  autoDelete: boolean | string | null
}

const initialState: AccountSettings = {
  autoSync: false,
  autoDelete: false,
}

export const accountSettingsSlice = createSlice({
  name: 'accountSettings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<AccountSettings>) => {
      state = action.payload
      return state
    },
  },
})

export const { updateSettings } = accountSettingsSlice.actions

export const selectAccountSettings = (state: RootState) => state.accountSettings

export default accountSettingsSlice.reducer
