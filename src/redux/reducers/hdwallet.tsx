// A reducer is a function that receives the current state and an action object, 
// decides how to update the state if necessary, and returns the new state: (state, action) => newState.
// You can think of a reducer as an event listener which handles events based on the received action (event) type.
import {HDWallet} from './reducer'

const initialState:HDWallet = {
    seed:'',
    mnem:'',
    nbit:128,
    mprv:'',
    mpub:'',
    mchn:'',
    derp:'',
    cprv:'',
    cpub:'',
    cchn:'',
    btc:'',
    eth:'',
    mnemsuc:true,
    did:''
}

export default function (state: HDWallet = initialState, action: { type: string, payload: string }) {
    switch (action.type) {
        case 'SET_SEED': {
            return {...state, seed: action.payload};
        }
        case 'SET_MNEM': {
            return {...state, mnem: action.payload};
        }
        case 'SET_MPRV': {
            return {...state, mprv: action.payload};
        }
        case 'SET_NBIT': {
            return {...state, nbit: action.payload};
        }
        case 'SET_MPUB': {
            return {...state, mpub: action.payload};
        }
        case 'SET_MCHN': {
            return {...state, mchn: action.payload};
        }
        case 'SET_DERP': {
            return {...state, derp: action.payload};
        }
        case 'SET_CPRV': {
            return {...state, cpub: action.payload};
        }
        case 'SET_CPUB': {
            return {...state, cprv: action.payload};
        }
        case 'SET_CCHN': {
            return {...state, cchn: action.payload};
        }
        case 'SET_BTC': {
            return {...state, btc: action.payload};
        }
        case 'SET_ETH': {
            return {...state, eth: action.payload};
        }
        case 'SET_MNEM_SUC': {
            return {...state, mnemsuc: action.payload}
        }
        case 'SET_DID_DET': {
            return {...state, did: action.payload}
        }
        default:
            return state;
    }
}
