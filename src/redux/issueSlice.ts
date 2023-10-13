import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface IssueState {
    holderPublicKey: string;
    signerPrivateKey: string;
    signerPublicKey: string;
    keyArray: string[];
    valueArray: string[];
    inputComponentList: number[];
    vc: string;
    publicKeyEncoding: string;
}

const initialState: IssueState = {
    holderPublicKey: 'c2196d230267c18d101e51cb34d318e375f2100c268f2ffd6e9baef1d905a058',
    signerPrivateKey: 'ed710c0f8812e360dafa4dd2888b7ff24d2401223daf961e7e78988a56fa24a4',
    signerPublicKey: '',
    keyArray: ['@context', 'id', 'issuanceDate', 'type', 'issuer', 'credentialSubject'],
    valueArray: [
        `['https://www.w3.org/2018/credentials/v1','https://d202eicx1ap3m7.cloudfront.net/credentials/microrewards/v0-01/siop-tools-schema-v0-01.json']`,
        'http://localhost:8080/verify/1',
        new Date().toISOString(),
        `['VerifiableCredential']`,
        'did:key:z6Mkoqgh9AppS2s28onvE4Qy9jwDBJ8ZqRdBtoWLSsRL57Jj',
        `{"type":['DemoCredential'],"customAttribute":[]}`
    ],
    inputComponentList: [0, 1, 2, 3, 4, 5],
    vc: '',
    publicKeyEncoding: 'Base64'
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
        setPublicKeyEncoding: (state, action: PayloadAction<string>) => {
            state.publicKeyEncoding = action.payload;
        }
    }
});

export const {
    setHolderPublicKey,
    setSignerPrivateKey,
    setInputComponentList,
    setSignerPublicKey,
    setKeyArray,
    setValueArray,
    setVC,
    setPublicKeyEncoding
} = issueSlice.actions;

export const _holderPublicKey = (state: RootState) => state.issue.holderPublicKey;
export const _signerPrivateKey = (state: RootState) => state.issue.signerPrivateKey;
export const _signerPublicKey = (state: RootState) => state.issue.signerPublicKey;
export const _keyArray = (state: RootState) => state.issue.keyArray;
export const _valueArray = (state: RootState) => state.issue.valueArray;
export const _inputComponentList = (state: RootState) => state.issue.inputComponentList;
export const _vc = (state: RootState) => state.issue.vc;
export const _publicKeyEncoding = (state: RootState) => state.issue.publicKeyEncoding;

export default issueSlice.reducer;
