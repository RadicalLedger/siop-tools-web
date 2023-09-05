import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface ResolveDidState {
    did: string;
    didDoc: string;
}

const initialState: ResolveDidState = {
    did: '',
    didDoc: ''
};

export const resolveDidSlice = createSlice({
    name: 'resolveDID',
    initialState,
    reducers: {
        setDID: (state, action: PayloadAction<string>) => {
            state.did = action.payload;
        },
        setDidDoc: (state, action: PayloadAction<string>) => {
            state.didDoc = action.payload;
        }
    }
});

export const { setDID, setDidDoc } = resolveDidSlice.actions;

export const _did = (state: RootState) => state.resolveDID.did;
export const _didDoc = (state: RootState) => state.resolveDID.didDoc;

export default resolveDidSlice.reducer;
