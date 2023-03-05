import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface GeneratorSettingsState {
  phrase1?: string | null
  phrase2?: string | null
  phrase3?: string | null
  phrase4?: string | null
  phrase5?: string | null
  phrase6?: number | null
  phrase7?: number | null
  numberOfGenerated: number
}

const initialState: GeneratorSettingsState = {
  phrase1: null,
  phrase2: null,
  phrase3: null,
  phrase4: null,
  phrase5: null,
  phrase6: null,
  phrase7: null,
  numberOfGenerated: 1,
}

export const genSettingsSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    updateGenSettings: (
      state,
      action: PayloadAction<GeneratorSettingsState>
    ) => {
      state = action.payload
      return state
    },
  },
})

export const { updateGenSettings } = genSettingsSlice.actions

export const selectGenSettings = (state: RootState) => state.generator

export default genSettingsSlice.reducer
