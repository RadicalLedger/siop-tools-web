import { ecdsaSign, ecdsaVerify, publicKeyCreate } from 'secp256k1'
import shajs from 'sha.js'

import { base64UrlEncode, base64UrlDecode, ERRORS, resolveIdentity, blind } from './utils'
import publicKeyToAddress from 'ethereum-public-key-to-address';

export interface Claims {
    [key: string]: string
}

export interface Mask {
    [key: string]: boolean
}

export interface VC {
    context?: string,
    issuer: {
        did: string,
        publicKey: string
    },
    subject: {
        did: string,
        publicKey: string
    },
    type: string,
    claims: Claims,
    proof: string,
    iat?: string,
    exp?: string,
    mask?: Mask
}

export interface VP {
    context?: string,
    subject: {
        did: string,
        publicKey: string
    },
    type: string,
    credentials: Array<VC>,
    proof: string,
}

export function issue(claims: Claims, signerPrivateKey: string, holderPublicKey: string): VC {

    const maskedClaims:Claims = {};
    for (const key in claims) {
        try {
            const maskedKey = blind(key, holderPublicKey);
            maskedClaims[maskedKey] = blind(claims[key], holderPublicKey);
        } catch (error) {
            throw Error(`Masking failed\n${error.message}`);
        }
    }
    const sortedClaimString = JSON.stringify(maskedClaims, Object.keys(maskedClaims).sort());
    const claimStringHash: string = new shajs.sha256().update(sortedClaimString).digest('hex');
    const claimHashBuffer = Buffer.from(claimStringHash, 'hex');

    const signerPrivateKeyBuffer = Buffer.from(signerPrivateKey, 'hex');
    const signerPublicKeyBuffer = Buffer.from(publicKeyCreate(signerPrivateKeyBuffer));
    const signerPublicKey = signerPublicKeyBuffer.toString('hex');
    const signerDID = "did:ethr:" + publicKeyToAddress(signerPublicKey);

    const holderDID = "did:ethr:" + publicKeyToAddress(holderPublicKey);

    const proof: string = base64UrlEncode(JSON.stringify(ecdsaSign(claimHashBuffer, signerPrivateKeyBuffer)));
    const mask = {};
    const vc: VC = {
        type: "VerifiableCredential",
        issuer: {
            did: signerDID,
            publicKey: signerPublicKey
        },
        subject: {
            did: holderDID,
            publicKey: holderPublicKey
        },
        claims,
        proof,
        mask
    }
    return vc;
}

export function present(credentials: VC[], masks: Mask[], holderPrivateKey: string): VP {
    const maskedCredentials: VC[] = [];
    const holderPrivateKeyBuffer = Buffer.from(holderPrivateKey, 'hex');
    const holderPublicKeyBuffer = Buffer.from(publicKeyCreate(holderPrivateKeyBuffer));
    const holderPublicKey = holderPublicKeyBuffer.toString('hex');

    for (let index = 0; index < credentials.length; index++) {
        const item: VC = credentials[index];
        const claims = item.claims;

        const mask = masks[index];
        const maskedClaims:Claims = {};
        for (const key in claims) {
            if (mask[key] !== true) {
                maskedClaims[key] = claims[key]
            }
        }
        const maskedMask:Mask = {};
        for (const key in mask) {
            if (mask[key]) {
                if (claims[key]) {
                    try {
                        const maskedKey = blind(key, holderPublicKey);
                        const maskedValue = blind(claims[key], holderPublicKey);
                        maskedClaims[maskedKey] = maskedValue;
                        maskedMask[maskedKey] = true;
                    } catch (error) {
                        throw Error(`Masking failed\n${error.message}`)
                    }
                }
            }
        }
        const maskedCredential = { ...item, claims: maskedClaims, mask: maskedMask };
        maskedCredentials.push(maskedCredential);
    }

    const maskedCredentialString = JSON.stringify(maskedCredentials);
    const credentialHash: string = new shajs.sha256().update(maskedCredentialString).digest('hex');
    const credentialsHashBuffer = Buffer.from(credentialHash, 'hex');
    const proof: string = base64UrlEncode(JSON.stringify(ecdsaSign(credentialsHashBuffer, holderPrivateKeyBuffer)));

    const derivedDID = publicKeyToAddress(holderPublicKey);
    const presentation: VP = {
        subject: {
            did: "did:ethr:" + derivedDID,
            publicKey: holderPublicKey
        },
        type: "VerifiablePresentation",
        credentials: maskedCredentials,
        proof
    };
    return presentation
}

export async function verify(vp: VP, signerPublicKeys: string[], holderPublicKey: string): Promise<boolean> {

    checkVpMetaData(vp);
    const { credentials, proof } = vp;

    for (const vc of credentials) {
        try {
            if (signerPublicKeys.includes(vc.issuer.publicKey)) {
                await verifyVC(vc, vc.issuer.publicKey, holderPublicKey)
            } else {
                throw Error(ERRORS.INVALID_ISSUER_PUBLIC_KEY)
            }

        } catch (e) {
            throw Error(`At least one credential is not valid\n${e.message}`)
        }
    }
    return verifyVpSignature(credentials, proof, holderPublicKey);
}

export async function verifyVC(vc: VC, signerPublicKey: string, holderPublicKey: string): Promise<boolean> {

    checkVcMetaData(vc);
    const { claims, proof, mask } = vc;

    await resolveIdentity(vc.issuer.did, signerPublicKey);
    return verifyVcSignature(claims, mask, proof, signerPublicKey, holderPublicKey);
}

export function verifyVcSignature(claims: Claims, mask: Mask| undefined, proof: string, signerPublicKey: string, holderPublicKey: string): boolean {

    mask = mask || {};
    const maskedClaims:Claims = {};

    for (const key in claims) {
        if (!mask[key]) {
            if (claims[key]) {
                try {
                    const maskedKey = blind(key, holderPublicKey);
                    maskedClaims[maskedKey] = blind(claims[key], holderPublicKey);
                } catch (error) {
                    throw Error(`Masking failed\n${error.message}`);
                }
            }
        } else {
            maskedClaims[key] = claims[key];
        }
    }

    const sortedClaimString = JSON.stringify(maskedClaims, Object.keys(maskedClaims).sort());
    const claimStringHash: string = new shajs.sha256().update(sortedClaimString).digest('hex');
    const claimHashBuffer = Buffer.from(claimStringHash, 'hex');
    const signerPublicKeyBuffer = Buffer.from(signerPublicKey, 'hex');

    try {
        const signatureObject = JSON.parse(base64UrlDecode(proof)).signature;
        const signatureArray = Uint8Array.from(Object.keys(signatureObject).map((key) => signatureObject[key]));
        const signature = ecdsaVerify(signatureArray, claimHashBuffer, signerPublicKeyBuffer);

        if (!signature) {
            throw Error(ERRORS.NO_PROOF_VC);
        } else {
            return true;
        }
    } catch (error) {
        throw Error(`${ERRORS.NO_PROOF_VC}\n${error.message}`);
    }
}


export function verifyVpSignature(credentials: VC[], proof: string, holderPublicKey: string): boolean {

    const credentialString = JSON.stringify(credentials);
    const credentialHash = new shajs.sha256().update(credentialString).digest('hex');
    const credentialsHashBuffer = Buffer.from(credentialHash, 'hex');
    const holderPublicKeyBuffer = Buffer.from(holderPublicKey, 'hex');
    try {
        const signatureObject = JSON.parse(base64UrlDecode(proof)).signature
        const signatureArray = Uint8Array.from(Object.keys(signatureObject).map((key) => signatureObject[key]));
        const signature = ecdsaVerify(signatureArray, credentialsHashBuffer, holderPublicKeyBuffer);
        if (!signature) {
            throw Error(ERRORS.NO_PROOF_VP);
        } else {
            return true;
        }
    } catch (error) {
        throw Error(`${ERRORS.NO_PROOF_VP}\n${error.message}`);
    }
}

export function checkVcMetaData(vc: VC): void {
    const { issuer, subject, type, claims, proof } = vc;
    if (!proof) {
        throw new Error(ERRORS.NO_PROOF_VC);
    }
    if (!issuer) {
        throw new Error(ERRORS.NO_ISSUER);
    }
    if (type !== 'VerifiableCredential') {
        throw new Error(ERRORS.TYPE_NOT_VALID);
    }
    else if (!issuer.did) {
        throw new Error(ERRORS.NO_ISSUER_DID);
    }
    else if (!issuer.publicKey) {
        throw new Error(ERRORS.NO_ISSUER_PUBLIC_KEY);
    }
    if (!subject) {
        throw new Error(ERRORS.NO_SUBJECT);
    }
    else if (!subject.did) {
        throw new Error(ERRORS.NO_SUBJECT_DID);
    }
    else if (!subject.publicKey) {
        throw new Error(ERRORS.NO_SUBJECT_PUBLIC_KEY);
    }
    if (!claims) {
        throw new Error(ERRORS.NO_CLAIMS);
    }
}

export function checkVpMetaData(vp: VP): void {
    const { subject, credentials, type, proof } = vp;
    if (!proof) {
        throw new Error(ERRORS.NO_PROOF_VC);
    }
    if (!subject) {
        throw new Error(ERRORS.NO_SUBJECT);
    }
    if (type !== 'VerifiablePresentation') {
        throw new Error(ERRORS.TYPE_NOT_VALID);
    }
    else if (!subject.did) {
        throw new Error(ERRORS.NO_SUBJECT_DID);
    }
    else if (!subject.publicKey) {
        throw new Error(ERRORS.NO_SUBJECT_PUBLIC_KEY);
    }
    if (!credentials) {
        throw new Error(ERRORS.NO_CREDENTIALS);
    } else if (credentials.length < 1) {
        throw new Error(ERRORS.NO_CREDENTIALS);
    }
}

export { base64UrlEncode, base64UrlDecode } from './utils';