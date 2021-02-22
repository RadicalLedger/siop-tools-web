import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface VerifyState {
  holderPublicKey: string;
  signerPublicKey: string;
  presentation: string;
  verified:string
}

const initialState: VerifyState = {
  holderPublicKey: '',
  signerPublicKey: '',
  presentation: '',
  verified: ''
};

export const verifySlice = createSlice({
  name: 'present',
  initialState,
  reducers: {

    setHolderPublicKey: (state, action: PayloadAction<string>) => {
      state.holderPublicKey = action.payload;
    },
    setSignerPublicKey: (state, action: PayloadAction<string>) => {
      state.signerPublicKey = action.payload;
    },
    setPresentation: (state, action: PayloadAction<string>) => {
      state.presentation = action.payload;
    },
    setVerified: (state, action: PayloadAction<string>) => {
      state.verified = action.payload;
    },
  },
});

export const { setHolderPublicKey, setPresentation, setSignerPublicKey, setVerified } = verifySlice.actions;

export const _holderPublicKey = (state: RootState) => state.verify.holderPublicKey;
export const _signerPublicKey = (state: RootState) => state.verify.signerPublicKey;
export const _presentation = (state: RootState) => state.verify.presentation;
export const _verified = (state: RootState) => state.verify.verified;

export default verifySlice.reducer;
