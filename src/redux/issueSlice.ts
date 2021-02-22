import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface IssueState {
  holderPublicKey: string;
  signerPrivateKey: string;
  signerPublicKey: string;
  keyArray:string[];
  valueArray:string[];
  inputComponentList: number[];
  vc:string
}

const initialState: IssueState = {
  holderPublicKey: '',
  signerPrivateKey: '',
  signerPublicKey: '',
  keyArray:[''],
  valueArray:[''],
  inputComponentList: [0],
  vc: ''
};

export const issueSlice = createSlice({
  name: 'issue',
  initialState,
  reducers: {

    setHolderPublicKey: (state, action: PayloadAction<string>) => {
      state.holderPublicKey = action.payload;
    },
    setSignerPrivateKey: (state, action: PayloadAction<string>) => {
      state.signerPrivateKey = action.payload;
    },
    setSignerPublicKey: (state, action: PayloadAction<string>) => {
      state.signerPublicKey = action.payload;
    },
    setKeyArray: (state, action: PayloadAction<string[]>) => {
      state.keyArray = action.payload;
    },
    setValueArray: (state, action: PayloadAction<string[]>) => {
      state.valueArray = action.payload;
    },
    setInputComponentList: (state, action: PayloadAction<number[]>) => {
      state.inputComponentList = action.payload;
    },
    setVC: (state, action: PayloadAction<string>) => {
      state.vc = action.payload;
    },
  },
});

export const { setHolderPublicKey, setSignerPrivateKey, setInputComponentList, setSignerPublicKey, setKeyArray, setValueArray, setVC } = issueSlice.actions;

export const _holderPublicKey = (state: RootState) => state.issue.holderPublicKey;
export const _signerPrivateKey = (state: RootState) => state.issue.signerPrivateKey;
export const _signerPublicKey = (state: RootState) => state.issue.signerPublicKey;
export const _keyArray = (state: RootState) => state.issue.keyArray;
export const _valueArray = (state: RootState) => state.issue.valueArray;
export const _inputComponentList = (state: RootState) => state.issue.inputComponentList;
export const _vc = (state: RootState) => state.issue.vc;

export default issueSlice.reducer;
