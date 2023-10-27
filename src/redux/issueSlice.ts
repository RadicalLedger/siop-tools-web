import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import _ from 'lodash';

interface IssueState {
    holderPublicKey: string;
    signerPrivateKey: string;
    signerPublicKey: string;
    jsonValue: object;
    jsonEditorValue: object;
    vc: string;
    publicKeyEncoding: string;
}

const initialState: IssueState = {
    holderPublicKey: 'c2196d230267c18d101e51cb34d318e375f2100c268f2ffd6e9baef1d905a058',
    signerPrivateKey: 'ed710c0f8812e360dafa4dd2888b7ff24d2401223daf961e7e78988a56fa24a4',
    signerPublicKey: '',
    jsonValue: {},
    jsonEditorValue: {
        id: _.uniqueId(),
        type: 'object',
        data_type: 'object',
        attribute: 'data',
        data: [
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'array',
                data_options: { type: 'text', remove: true },
                attribute: '@context',
                add: true,
                data: [
                    {
                        id: _.uniqueId(),
                        type: 'text',
                        remove: true,
                        data: 'https://www.w3.org/2018/credentials/v1'
                    },
                    {
                        id: _.uniqueId(),
                        type: 'text',
                        remove: true,
                        data: 'https://d202eicx1ap3m7.cloudfront.net/credentials/microrewards/v0-01/siop-tools-schema-v0-01.json'
                    }
                ]
            },
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'text',
                attribute: 'id',
                data: [{ id: _.uniqueId(), type: 'text', data: 'http://localhost:8080/verify/1' }]
            },
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'text',
                attribute: 'issuanceDate',
                data: [{ id: _.uniqueId(), type: 'text', data: new Date().toISOString() }]
            },
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'array',
                attribute: 'type',
                data: [{ id: _.uniqueId(), type: 'text', data: 'VerifiableCredential' }]
            },
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'text',
                attribute: 'issuer',
                data: [
                    {
                        id: _.uniqueId(),
                        type: 'text',
                        data: 'did:key:z6Mkoqgh9AppS2s28onvE4Qy9jwDBJ8ZqRdBtoWLSsRL57Jj'
                    }
                ]
            },
            {
                id: _.uniqueId(),
                type: 'object',
                data_type: 'object',
                data_options: {
                    type: 'object',
                    data: [{ type: 'text', data: '' }],
                    remove: true
                },
                attribute: 'credentialSubject',
                add: true,
                data: [
                    {
                        id: _.uniqueId(),
                        type: 'object',
                        data_type: 'array',
                        attribute: 'type',
                        remove: true,
                        data: [
                            {
                                id: _.uniqueId(),
                                type: 'text',
                                data: 'DemoCredential'
                            }
                        ]
                    },
                    {
                        id: _.uniqueId(),
                        type: 'object',
                        data_type: 'array',
                        attribute: 'customAttribute',
                        data_options: {
                            type: 'object',
                            data_type: 'object',
                            remove: true,
                            no_attribute: true,
                            data: [
                                {
                                    type: 'object',
                                    attribute: 'name',
                                    data: [{ type: 'text', data: '' }]
                                },
                                {
                                    type: 'object',
                                    attribute: 'value',
                                    data: [{ type: 'text', data: '' }]
                                }
                            ]
                        },
                        add: true,
                        remove: true,
                        data: [
                            {
                                id: _.uniqueId(),
                                type: 'object',
                                data_type: 'object',
                                remove: true,
                                no_attribute: true,
                                attribute: '',
                                data: [
                                    {
                                        type: 'object',
                                        attribute: 'name',
                                        data: [{ type: 'text', data: 'test name 1' }]
                                    },
                                    {
                                        type: 'object',
                                        attribute: 'value',
                                        data: [{ type: 'text', data: 'test value 1' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
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
        setJsonValue: (state, action: PayloadAction<object>) => {
            state.jsonValue = action.payload;
        },
        setJsonEditorValue: (state, action: PayloadAction<object>) => {
            state.jsonEditorValue = action.payload;
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
    setSignerPublicKey,
    setVC,
    setPublicKeyEncoding,
    setJsonValue,
    setJsonEditorValue
} = issueSlice.actions;

export const _holderPublicKey = (state: RootState) => state.issue.holderPublicKey;
export const _signerPrivateKey = (state: RootState) => state.issue.signerPrivateKey;
export const _signerPublicKey = (state: RootState) => state.issue.signerPublicKey;
export const _jsonValue = (state: RootState) => state.issue.jsonValue;
export const _jsonEditorValue = (state: RootState) => state.issue.jsonEditorValue;
export const _vc = (state: RootState) => state.issue.vc;
export const _publicKeyEncoding = (state: RootState) => state.issue.publicKeyEncoding;

export default issueSlice.reducer;
