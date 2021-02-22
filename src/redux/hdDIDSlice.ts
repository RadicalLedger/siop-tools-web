import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface HdDidState {
    strength: number;
    seed: string;
    mnemonic: string;
    masterPrivateKey: string;
    masterChainCode: string;
    masterPublicKey: string;
    derivationPath: string;
    childPrivateKey: string;
    childChainCode: string;
    childPublicKey: string;
    address: string;
    did: string;
    validMnemonic:boolean;
}

const initialState: HdDidState = {
    strength: 128,
    seed: '',
    mnemonic: '',
    masterPrivateKey: '',
    masterChainCode: '',
    masterPublicKey: '',
    derivationPath: '',
    childPrivateKey: '',
    childChainCode: '',
    childPublicKey: '',
    address: '',
    did: '',
    validMnemonic:true
};

export const hdDidSlice = createSlice({
    name: 'hdDID',
    initialState,
    reducers: {
        setStrength: (state, action: PayloadAction<number>) => {
            state.strength = action.payload;
        },
        setSeed: (state, action: PayloadAction<string>) => {
            state.seed = action.payload;
        },
        setMnemonic: (state, action: PayloadAction<string>) => {
            state.mnemonic = action.payload;
        },
        setMasterPrivateKey: (state, action: PayloadAction<string>) => {
            state.masterPrivateKey = action.payload;
        },
        setMasterChainCode: (state, action: PayloadAction<string>) => {
            state.masterChainCode = action.payload;
        },
        setMasterPublicKey: (state, action: PayloadAction<string>) => {
            state.masterPublicKey = action.payload;
        },
        setDerivationPath: (state, action: PayloadAction<string>) => {
            state.derivationPath = action.payload;
        },
        setChildPrivateKey: (state, action: PayloadAction<string>) => {
            state.childPrivateKey = action.payload;
        },
        setChildChainCode: (state, action: PayloadAction<string>) => {
            state.childChainCode = action.payload;
        },
        setChildPublicKey: (state, action: PayloadAction<string>) => {
            state.childPublicKey = action.payload;
        },
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },
        setDID: (state, action: PayloadAction<string>) => {
            state.did = action.payload;
        },
        setMnemonicValidity: (state, action: PayloadAction<boolean>) => {
            state.validMnemonic = action.payload;
        },
    },
});

export const { setAddress, setDID, setChildChainCode, setChildPrivateKey, setChildPublicKey, setDerivationPath, setMasterChainCode, setMasterPrivateKey, setMasterPublicKey, setMnemonic, setSeed, setStrength, setMnemonicValidity } = hdDidSlice.actions;

export const _strength = (state: RootState) => state.hdDid.strength;
export const _mnemonic = (state: RootState) => state.hdDid.mnemonic;
export const _seed = (state: RootState) => state.hdDid.seed;
export const _masterPrivateKey = (state: RootState) => state.hdDid.masterPrivateKey;
export const _masterChainCode = (state: RootState) => state.hdDid.masterChainCode;
export const _masterPublicKey = (state: RootState) => state.hdDid.masterPublicKey;
export const _derivationPath = (state: RootState) => state.hdDid.derivationPath;
export const _childPrivateKey = (state: RootState) => state.hdDid.childPrivateKey;
export const _childChainCode = (state: RootState) => state.hdDid.childChainCode;
export const _childPublicKey = (state: RootState) => state.hdDid.childPublicKey;
export const _address = (state: RootState) => state.hdDid.address;
export const _did = (state: RootState) => state.hdDid.did;
export const _validMnemonic = (state: RootState) => state.hdDid.validMnemonic;

export default hdDidSlice.reducer;
