import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  choosenCurrency: '',
  currencyToShow: 0,
  itemsInBag: [],
  currentlyOpen: '',
  categoriesList: [],
  currenciesList: [],
  currentCategory: '',
  defaultCategory: '',
  numberOfItemsInBag: 0,
  choosenAttributes: []
  }

export const slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    update: (state, action) => {
      state[action.payload.name] = action.payload.value
    },
    increaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag += 1
    },
    decreaseNumberOfItemsInBag: (prev) => {
      prev.numberOfItemsInBag -= 1
    }
  },
})

export const { 
  update,
  increaseNumberOfItemsInBag,
  decreaseNumberOfItemsInBag } = slice.actions

export default slice.reducer