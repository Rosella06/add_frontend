import { combineReducers } from 'redux'
import utilsReducer from './setUtilsReducer'

const rootReducer = combineReducers({
  utils: utilsReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
