import React from 'react'
import {CredentialCreator} from './reducer'
import InputComponent from '../../components/InputComponent'

const initialState:CredentialCreator = {
    keyArray: [''],
    valueArray: [''],
    privateKey: '',
    publicKey: '',
    credential: '',
    inputComponentList: [<InputComponent index={0} />]
}

export default function (state: CredentialCreator = initialState, action: { type: string, payload: [string] | string}) {
    switch (action.type) {
        case 'SET_CRED_KEY': {
            return {...state, keyArray:action.payload};
        }
        case 'SET_CRED_VAL': {
            return {...state, valueArray:action.payload};
        }
        case 'SET_PRIV_KEY': {
            return {...state, privateKey: action.payload};
        }
        case 'SET_PUB_KEY': {
            return {...state, publicKey: action.payload};
        }
        case 'SET_CREATE_VC': {
            return {...state, credential: action.payload};
        }
        case 'SET_INP_COMP': {
            return {...state, inputComponentList: action.payload};
        }
        default:
            return state;
    }
}
