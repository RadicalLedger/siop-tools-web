import {CredentialVerifier} from './reducer'

const initialState:CredentialVerifier = {
    vc: '',
    publicKey:'',
    credential: '{}'
}

export default function (state: CredentialVerifier = initialState, action: { type: string, payload: string }) {
    switch (action.type) {
        case 'SET_VERIFY_VC': {
            return {...state, vc: action.payload};
        }
        case 'SET_VERIFY_PUB_KEY': {
            return {...state, publicKey: action.payload};
        }
        case 'SET_VERIFY_CRED': {
            return {...state, credential: action.payload};
        }
        default:
            return state;
    }
}
