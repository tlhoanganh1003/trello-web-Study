import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoardSlice/activeBoardSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer
  }
})