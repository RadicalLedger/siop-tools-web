import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface offResolverState {
    did: string;
    didDoc: string;
}

const initialState: offResolverState = {
    did: '',
    didDoc: ''
};

export const offResolverSlice = createSlice({
    name: 'off-resolve',
    initialState,
    reducers: {
        setDID: (state, action: PayloadAction<string>) => {
            state.did = action.payload;
        },
        setDIDDocument: (state, action: PayloadAction<string>) => {
            state.didDoc = action.payload;
        }
    }
});

export const { setDID, setDIDDocument } = offResolverSlice.actions;

export const _did = (state: RootState) => state.offResolve.did;
export const _didDoc = (state: RootState) => state.offResolve.didDoc;

export default offResolverSlice.reducer;
