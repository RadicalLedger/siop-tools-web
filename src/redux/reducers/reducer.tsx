import { useSelector, TypedUseSelectorHook } from 'react-redux'

export interface HDWallet {
    seed: string,
    mnem: string,
    nbit: number,
    mprv: string,
    mpub: string,
    mchn: string,
    derp: string,
    cprv: string,
    cpub: string,
    cchn: string,
    btc: string,
    eth: string,
    mnemsuc:boolean,
    did:string
}

export interface DIDGenerator {
    address:string,
    privateKey:string,
    did:string
}

export interface DIDResolver {
    did:string,
    didDoc:string
}

export interface View {
    ctyp:string,
    view:number
}

export interface CredentialCreator {
    keyArray:[string],
    valueArray:[string],
    privateKey:string,
    publicKey:string,
    credential:string,
    inputComponentList:[any]
}

export interface CredentialVerifier {
    vc:string,
    publicKey:string,
    credential:string
}

interface RootState {
    views: View,
    hdwallet: HDWallet,
    didGenerator: DIDGenerator,
    didResolver: DIDResolver,
    credentialCreator: CredentialCreator,
    credentialVerifier: CredentialVerifier
}



export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector