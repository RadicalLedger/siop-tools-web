import {DIDGenerator} from './reducer'

const initialState:DIDGenerator = {
    address:'',
    privateKey:'',
    did:''
}

export default function (state: DIDGenerator = initialState, action: { type: string, payload: string }) {
    switch (action.type) {
        case 'SET_ADDR': {
            return {...state, address: action.payload};
        }
        case 'SET_PRIV': {
            return {...state, privateKey: action.payload};
        }
        case 'SET_DID_GEN': {
            return {...state, did: action.payload};
        }
        default:
            return state;
    }
}
