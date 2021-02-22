# did-hd-wallet

A wrapper package of bip32 and bip39 to generate ethr decentralized IDs

## Inastallation

1. Clone repository
2. run *npm run build* 
3. npm install < local repository directory >

## Usage

### generateMnemonic

import { generateMnemonic } from 'did-hd-wallet';

generate random mnemonic.

#### Parameters

1. strength : number - Integer between 128 - 256.

#### Returns

1. mnemonic: string - mnemonic words range from 12 to 24.

### getSeedFromMnemonic

import { getSeedFromMnemonic } from 'did-hd-wallet';

get seed from mnemonic words.

#### Parameters

1. mnemonic : string - valid mnemonic phrase.

#### Returns

1. seed: string - hex encoded seed.

### getEthAddress

import { getEthAddress } from 'did-hd-wallet';

get ethereum address of a public key.

#### Parameters

1. publicKey : string - public key of which the address is needed.

#### Returns

1. address: string - Ethereum address.

### getDID

import { getDID } from 'did-hd-wallet';

get ethereum decentralized id of an Ethereum address.

#### Parameters

1. address : string - Ethereum adress of which the DID is needed.

#### Returns

1. DID: string - Ethereum DID.

### Wallet Class

import Wallet from 'did-hd-wallet';

#### Public methods

##### getMasterPrivateKey

##### Parameters

None

##### Returns

1. masterPrivateKey: string - hex encoded master private key.

##### getMasterPublicKey

##### Parameters

None

##### Returns

1. masterPublicKey: string - hex encoded master public key.

##### getMasterChainCode

##### Parameters

None

##### Returns

1. masterChainCode: string - hex encoded master chain code.

##### getMasterMnemonic

##### Parameters

None

##### Returns

1. masterMnemonic: string - master mnemonic phrase.

##### getChildKeys

##### Parameters

1. path: string - valid derivation path.

##### Returns

1. childKeys: object - JS object containing child private key, child public key and child chain code.