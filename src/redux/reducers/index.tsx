import { combineReducers } from "redux";
import views from './views'
import hdwallet from './hdwallet'

export const rootReducer = combineReducers({
    views: views,
    hdwallet: hdwallet
})

export type RootState = ReturnType<typeof rootReducer>
