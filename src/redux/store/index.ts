import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducers/rootReducer'

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.VITE_APP_NODE_ENV === 'development'
})

export default store
