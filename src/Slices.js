import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    counter1: 0,
    counter2: 0
  }

export const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment1: (state) => {
      state.counter1 += 1
    },
    decrement1: (state) => {
      state.counter2 -= 1
    },
    incrementByAmount1: (state, action) => {
      state.counter1 += action.payload
    },
    incrementByAmount2: (state, action) => {
        state.counter2 += action.payload
      },
  },
})

export const { 
    increment1, 
    decrement1, 
    incrementByAmount1, 
    increment2, 
    decrement2, 
    incrementByAmount2 } = slice.actions

export default slice.reducer