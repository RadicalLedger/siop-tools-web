import * as hashUtils from "hash.js";

import axios from 'axios'
import publicKeyToAddress from 'ethereum-public-key-to-address'

export function base64UrlEncode(unencoded: string):string {
    return Buffer.from(unencoded).toString('base64').replace('+', '-').replace('/', '_').replace(/=+$/, '')
}

export function base64UrlDecode(encoded: string):string {
    encoded = encoded.replace('-', '+').replace('_', '/')
    while (encoded.length % 4) {
        encoded += '=';
    }
    return Buffer.from(encoded, 'base64').toString('utf8')
}

export function blind(data: string, key: string):string{
    const sha256 = hashUtils.sha256();
    const blinded = sha256.update(data + key).digest('hex');
    return blinded;
}

export async function resolveIdentity(did:string, publicKey:string):Promise<boolean>{
    try{
        const response = await axios.get('https://dev.uniresolver.io/1.0/identifiers/' + did);
        const result = response.data['didDocument'];
        if(
            result &&
            result.id == did &&
            result.authentication &&
            result.authentication.length > 0
        ){
            const derivedDID = publicKeyToAddress(publicKey);
            if("did:ethr:"+derivedDID === did){
                return true;
            }
            else{
                throw new Error(ERRORS.DID_PUBLIC_KEY_MISMATCH);
            }
        }else{
            throw new Error(ERRORS.INVALID_DOCUMENT);
        }
    }catch (e) {
        throw new Error(e.message)
    }
}


export const ERRORS = Object.freeze(
    {
        DID_PUBLIC_KEY_MISMATCH: 'Did does not match given public key',
        INVALID_DID_ERROR: 'Invalid did',
        INVALID_DOCUMENT: 'Invalid did document',
        TYPE_NOT_VALID: 'Document type not valid',
        NO_ISSUER: 'Issuer information is missing',
        NO_ISSUER_DID: 'Issuer did is missing',
        INVALID_ISSUER_PUBLIC_KEY: 'Issuer public key is not valid',
        NO_ISSUER_PUBLIC_KEY: 'Issuer public key is missing',
        NO_SUBJECT: 'Subject information is missing',
        NO_SUBJECT_DID: 'Subject did is missing',
        NO_SUBJECT_PUBLIC_KEY: 'Subject public key is missing',
        NO_CLAIMS: 'Claim information is missing',
        NO_CREDENTIALS: 'Credential information is missing',
        NO_PROOF_VC: 'Credential proof is missing',
        NO_PROOF_VP: 'Presentation proof is missing',
    }
);
