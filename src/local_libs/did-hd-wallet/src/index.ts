import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { BIP32Interface } from 'bip32';
import publicKeyToAddress from 'ethereum-public-key-to-address';
import EthrDID from 'ethr-did';
import W3 from 'web3';

export interface Keys {
    privateKey: string | undefined,
    publicKey: string,
    chainCode: string,
    base58: string,
    wif: string,
    ethAddress: string,
    did: string,
}

export enum Types {
    SEED,
    MNEMONIC,
    WIF,
    BASE58
}

const w3 = new W3();
export default class Wallet {

    private masterNode: BIP32Interface;
    private mnemonic: string | undefined;

    constructor(type: Types, value: string) {

        switch (type) {
            case (Types.SEED): {
                try {
                    this.mnemonic = undefined;
                    this.masterNode = bip32.fromSeed(Buffer.from(value, 'hex'));
                    break;
                } catch (e) {
                    throw Error(e);
                }
            }
            case (Types.MNEMONIC): {
                this.mnemonic = value;
                try {
                    const seed = getSeedFromMnemonic(value);
                    this.masterNode = bip32.fromSeed(Buffer.from(seed, 'hex'));
                } catch (e) {
                    throw Error(e);
                }
                break;
            }
            case (Types.BASE58): {
                try {
                    this.mnemonic = undefined;
                    this.masterNode = bip32.fromBase58(value);
                } catch (e) {
                    throw Error(e);
                }
                break;
            }
            default: {
                throw Error('Invalid parameters');
            }
        }
    }

    // constructor(mnemonic: string) {
    //     this.mnemonic = mnemonic;
    //     try {
    //         const seed = getSeedFromMnemonic(mnemonic);
    //         this.masterNode = bip32.fromSeed(Buffer.from(seed, 'hex'));
    //     } catch (e) {
    //         throw Error(e);
    //     }
    // }

    getMasterKeys() {
        const privateKey = this.masterNode.privateKey?.toString('hex');
        const chainCode = this.masterNode.chainCode.toString('hex');
        const publicKey = this.masterNode.publicKey.toString('hex');
        const base58 = this.masterNode.toBase58()
        const wif = this.masterNode.toWIF()
        const ethAddress = publicKeyToETH(publicKey);
        const did = getDID(ethAddress);
        return { privateKey, publicKey, chainCode, ethAddress, did }
    }

    getMasterPrivateKey(): string | undefined {
        return this.masterNode.privateKey?.toString('hex');
    }

    getMasterPublicKey(): string {
        return this.masterNode.publicKey.toString('hex');
    }

    getMasterChainCode(): string {
        return this.masterNode.chainCode.toString('hex');
    }

    getMasterMnemonic(): string | undefined {
        return this.mnemonic;
    }

    getChildKeys(path: string): Keys {
        try {
            const childNode: BIP32Interface = this.masterNode.derivePath(path);
            const privateKey = childNode.privateKey?.toString('hex');
            const chainCode = childNode.chainCode.toString('hex');
            const publicKey = childNode.publicKey.toString('hex');
            const base58 = childNode.toBase58()
            const wif = childNode.toWIF()
            const ethAddress = publicKeyToETH(publicKey);
            const did = getDID(ethAddress);

            return { privateKey, publicKey, chainCode, base58, wif, ethAddress, did };
        } catch (e) {
            throw Error(e);
        }
    }

    getBase58() {
        return this.masterNode.toBase58();
    }

    getWIF() {
        return this.masterNode.toWIF();
    }
}

export function generateMnemonic(strength: number): string {
    const mnemonic = bip39.generateMnemonic(strength);
    return mnemonic
}

export function validateMnemonic(mnemonic: string): boolean {
    return bip39.validateMnemonic(mnemonic)
}

export function getSeedFromMnemonic(mnemonic: string): string {
    if (validateMnemonic(mnemonic)) {
        try {
            const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex')
            return seed;
        } catch (e) {
            throw Error(e);
        }
    } else {
        throw Error('Not a valid mnemonic');
    }
}

export function publicKeyToETH(publicKey: string): string {
    const ethAddress = publicKeyToAddress(publicKey);
    return ethAddress;
}

export function getDID(address: string) {
    return `did:ethr:${address}`
}

export function createRandomETHDID() {
    const acc = w3.eth.accounts.create();
    const ethrDid = new EthrDID({ address: acc.address, privateKey: acc.privateKey });
    return { privateKey: acc.privateKey.replace('0x', ''), did: ethrDid.did }
}

export function createETHDIDFromPrivateKey(privateKey: string) {
    const acc = w3.eth.accounts.privateKeyToAccount(privateKey)
    const ethrDid = new EthrDID({ address: acc.address, privateKey: acc.privateKey });
    return { privateKey: acc.privateKey.replace('0x', ''), did: ethrDid.did }
}