import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface offUpdaterState {
    did: string;
    privateKey: string;
    publicKey: string;
    didDoc: string;
}

const initialState: offUpdaterState = {
    did: '',
    privateKey: '',
    publicKey: '',
    didDoc: ''
};

export const offUpdaterSlice = createSlice({
    name: 'off-updater',
    initialState,
    reducers: {
        setDID: (state, action: PayloadAction<string>) => {
            state.did = action.payload;
        },
        setPrivateKey: (state, action: PayloadAction<string>) => {
            state.privateKey = action.payload;
        },
        setPublicKey: (state, action: PayloadAction<string>) => {
            state.publicKey = action.payload;
        },
        setDIDDocument: (state, action: PayloadAction<string>) => {
            state.didDoc = action.payload;
        }
    }
});

export const { setDID, setDIDDocument, setPrivateKey, setPublicKey } = offUpdaterSlice.actions;

export const _did = (state: RootState) => state.offUpdater.did;
export const _didDoc = (state: RootState) => state.offUpdater.didDoc;
export const _privateKey = (state: RootState) => state.offUpdater.privateKey;
export const _publicKey = (state: RootState) => state.offUpdater.publicKey;

export default offUpdaterSlice.reducer;
