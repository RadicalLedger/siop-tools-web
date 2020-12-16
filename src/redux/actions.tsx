// An action is a plain JavaScript object that has a type field.
// You can think of an action as an event that describes something that happened in the application.
import {View} from './reducers/reducer'

export const setRandomSeed = (seed:string) => ({
    type: 'SET_SEED',
    payload: seed
})

export const setMnemonic = (mnem:string) => ({
    type: 'SET_MNEM',
    payload: mnem
})

export const setNumBits = (numBits:number) => ({
    type: 'SET_NBIT',
    payload: numBits
})

export const setMasterPrivateKey = (mprv:string) => ({
    type: 'SET_MPRV',
    payload: mprv
})

export const setMasterPublicKey = (mpub:string) => ({
    type: 'SET_MPUB',
    payload: mpub
})

export const setMasterChainCode = (mchn:string) => ({
    type: 'SET_MCHN',
    payload: mchn
})

export const setDerivationPath = (derp:string) => ({
    type: 'SET_DERP',
    payload: derp
})

export const setChildPrivateKey = (cprv:string) => ({
    type: 'SET_CPRV',
    payload: cprv
})

export const setChildPublicKey = (cpub:string) => ({
    type: 'SET_CPUB',
    payload: cpub
})

export const setChildChainCode = (cchn:string) => ({
    type: 'SET_CCHN',
    payload: cchn
})

export const setBTCAddress = (btc:string) => ({
    type: 'SET_BTC',
    payload: btc
})

export const setETHAddress = (eth:string) => ({
    type: 'SET_ETH',
    payload: eth
})

export const setMnemSuccess = (success:boolean) => ({
    type: 'SET_MNEM_SUC',
    payload: success
})

export const setCoinType = (ctyp:string) => ({
    type: 'SET_CTYP',
    payload: ctyp
})

export const setDIDDet = (did:string) => ({
    type: 'SET_DID_DET',
    payload: did
})

export const setView = (view:View) => ({
    type: 'SET_VIEW',
    payload: view
})

export const setDIDNDet = (did:string) => ({
    type: 'SET_DID_NDET',
    payload: did
})

export const setAddress = (address:string) => ({
    type: 'SET_ADDR',
    payload: address
})

export const setPrivateKey = (privateKey:string) => ({
    type: 'SET_PRIV',
    payload: privateKey
})

export const setDIDGen = (did:string) => ({
    type: 'SET_DID_GEN',
    payload: did
})

export const setDIDDoc = (didDoc:string) => ({
    type: 'SET_DID_DOC',
    payload: didDoc
})

export const setDIDRes = (did:string) => ({
    type: 'SET_DID_RES',
    payload: did
})

export const setCredentialKeyArray = (array:string[]) => ({
    type: 'SET_CRED_KEY',
    payload: array
})

export const setCredentialValueArray = (array:string[]) => ({
    type: 'SET_CRED_VAL',
    payload: array
})

export const setCreatorPrivateKey = (privateKey:string) => ({
    type: 'SET_PRIV_KEY',
    payload: privateKey
})

export const setCreatorPublicKey = (publicKey:string) => ({
    type: 'SET_PUB_KEY',
    payload: publicKey
})

export const setCreatorVC = (vc:string) => ({
    type: 'SET_CREATE_VC',
    payload: vc
})

export const setInputComponentList = (array:any[]) => ({
    type: 'SET_INP_COMP',
    payload: array
})

export const setVerifierVC = (vc:string) => ({
    type: 'SET_VERIFY_VC',
    payload: vc
})

export const setVerifierPublicKey = (publicKey:string) =>  ({
    type: 'SET_VERIFY_PUB_KEY',
    payload: publicKey
})

export const setVerifierCredentials = (credentials:string) => ({
    type: 'SET_VERIFY_CRED',
    payload: credentials
})