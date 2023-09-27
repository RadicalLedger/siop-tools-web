import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface OffCreatorState {
    address: string;
    did: string;
    privateKey: string;
    publicKey: string;
}

const initialState: OffCreatorState = {
    address: '',
    did: '',
    privateKey: '',
    publicKey: ''
};

export const offCreatorSlice = createSlice({
    name: 'offCreator',
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
        },
        setPublicKey: (state, action: PayloadAction<string>) => {
            state.publicKey = action.payload;
        }
    }
});

export const { setAddress, setDID, setPrivateKey, setPublicKey } = offCreatorSlice.actions;

export const _address = (state: RootState) => state.offCreator.address;
export const _did = (state: RootState) => state.offCreator.did;
export const _privateKey = (state: RootState) => state.offCreator.privateKey;
export const _publicKey = (state: RootState) => state.offCreator.publicKey;

export default offCreatorSlice.reducer;
