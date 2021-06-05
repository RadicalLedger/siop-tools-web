import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../redux/appSlice'
import issueReducer from '../redux/issueSlice'
import presentReducer from '../redux/presentSlice'
import verifyReducer from '../redux/verifySlice'
import normalDidReducer from '../redux/normalDIDSlice'
import hdDidReducer from '../redux/hdDIDSlice'
import resolveDidReducer from '../redux/resolveDIDSlice'
import offResolver from '../redux/offResolverSlice'
import offUpdater from '../redux/offUpdaterSlice'
import offRevoker from '../redux/offRevokerSlice'
import offCreator from '../redux/offCreatorSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    issue: issueReducer,
    present: presentReducer,
    verify: verifyReducer,
    normalDID:normalDidReducer,
    hdDid:hdDidReducer,
    resolveDID: resolveDidReducer,
    offCreator: offCreator,
    offResolve: offResolver,
    offUpdater: offUpdater,
    offRevoker: offRevoker
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
