import { combineReducers } from "redux";
import views from './views'
import hdwallet from './hdwallet'
import didGenerator from './didGenerator'
import didResolver from './didResolver'
import credentialCreator from './credentialCreator'
import credentialVerifier from './credentialVerifier'

export const rootReducer = combineReducers({
    views,
    hdwallet,
    didGenerator,
    didResolver,
    credentialCreator,
    credentialVerifier
})

export type RootState = ReturnType<typeof rootReducer>
