import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface NormalDidState {
    address: string;
    did: string;
    privateKey: string;
}

const initialState: NormalDidState = {
    address: '',
    did: '',
    privateKey: ''
};

export const normalDidSlice = createSlice({
    name: 'normalDID',
    initialState,
    reducers: {
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },
        setDID: (state, action: PayloadAction<string>) => {
            state.did = action.payload;
        },
        setPrivateKey: (state, action: PayloadAction<string>) => {
            state.privateKey = action.payload;
        }
    }
});

export const { setAddress, setDID, setPrivateKey } = normalDidSlice.actions;

export const _address = (state: RootState) => state.normalDID.address;
export const _did = (state: RootState) => state.normalDID.did;
export const _privateKey = (state: RootState) => state.normalDID.privateKey;

export default normalDidSlice.reducer;
