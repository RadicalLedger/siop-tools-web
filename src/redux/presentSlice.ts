import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface PresentState {
  holderPrivateKey: string;
  credentials: string[];
  masks:any[];
  inputComponentList: number[];
  vp:string
}

const initialState: PresentState = {
  holderPrivateKey: '',
  credentials: [''],
  masks:[{}],
  inputComponentList: [0],
  vp: ''
};

export const presentSlice = createSlice({
  name: 'present',
  initialState,
  reducers: {

    setHolderPrivateKey: (state, action: PayloadAction<string>) => {
      state.holderPrivateKey = action.payload;
    },
    setCredentials: (state, action: PayloadAction<any>) => {
      state.credentials = action.payload;
    },
    setMasks: (state, action: PayloadAction<any>) => {
      state.masks = action.payload;
    },
    setInputComponentList: (state, action: PayloadAction<number[]>) => {
      state.inputComponentList = action.payload;
    },
    setVP: (state, action: PayloadAction<string>) => {
      state.vp = action.payload;
    },
  },
});

export const { setHolderPrivateKey, setCredentials, setInputComponentList, setVP, setMasks } = presentSlice.actions;

export const _holderPrivateKey = (state: RootState) => state.present.holderPrivateKey;
export const _credentials = (state: RootState) => state.present.credentials;
export const _masks = (state: RootState) => state.present.masks;
export const _inputComponentList = (state: RootState) => state.present.inputComponentList;
export const _vp = (state: RootState) => state.present.vp;

export default presentSlice.reducer;
