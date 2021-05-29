import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface offRevokerState {
  did: string;
  privateKey: string;
  didDoc: string;
}

const initialState: offRevokerState = {
  did: '',
  privateKey: '',
  didDoc: ''
};

export const offRevokerSlice = createSlice({
  name: 'off-revoke ',
  initialState,
  reducers: {

    setDID: (state, action: PayloadAction<string>) => {
      state.did = action.payload;
    },
    setPrivateKey: (state, action: PayloadAction<string>) => {
        state.privateKey = action.payload;
      },
    setDIDDocument: (state, action: PayloadAction<string>) => {
      state.didDoc = action.payload;
    }
  },
});

export const { setDID, setPrivateKey, setDIDDocument } = offRevokerSlice.actions;

export const _did = (state: RootState) => state.offRevoker.did;
export const _privateKey = (state: RootState) => state.offRevoker.privateKey;
export const _didDoc = (state: RootState) => state.offRevoker.didDoc;

export default offRevokerSlice.reducer;
