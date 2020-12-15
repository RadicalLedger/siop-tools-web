import {DIDResolver} from './reducer'

const initialState:DIDResolver = {
    did:'',
    didDoc:''
}

export default function (state: DIDResolver = initialState, action: { type: string, payload: string }) {
    switch (action.type) {
        case 'SET_DID_RES': {
            return {...state, did: action.payload};
        }
        case 'SET_DID_DOC': {
            return {...state, didDoc: action.payload};
        }
        default:
            return state;
    }
}
