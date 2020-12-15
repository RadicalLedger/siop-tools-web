import { combineReducers } from "redux";
import views from './views'
import hdwallet from './hdwallet'
import didGenerator from './didGenerator'
import didResolver from './didResolver'

export const rootReducer = combineReducers({
    views,
    hdwallet,
    didGenerator,
    didResolver
})

export type RootState = ReturnType<typeof rootReducer>
