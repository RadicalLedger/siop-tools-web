### What is a digital key?
Like normal key, digital key is a piece of string that is used to authenticate and verify assets, digital assets.

### Public Key Cryptography (Asymmetric Key Cryptography)

Unlike in symmetric key cryptography where use same shared key for encryption and decryption, public key cryptography uses two different keys, namely private key and public key. Private key is just a number picked at random with sufficient level of randomness. There is a corresponding public key for every private key. That is public key can be derived from the private key, but not vice versa.

### Public Key Cryptography and Crypto-currency
Public key cryptography is crucial for the securing the crypto-currency.  Private key is the proof ownership of the crypto-currency. In every transaction owner of crypto-currency should present a signature, which is created using private key of the user and the public key of the user. Using these information network can verify the authenticity of the ownership.

### Elliptic Curve Cryptography
Elliptic Curve Cryptography(ECC) is a variant of public key cryptography based on the discrete logarithm problem as expressed by addition and multiplication on the point of an elliptic curve.

There is an operation “+” called “addition” which has a special property. Given two points on the elliptic curve addition of those points is also on the elliptic curve. Geometrically third point is the intersection point of the line across first two points and the curve. If the first two point are same, then third point will be the intersection of the tangent line to curve at first two points(which is actually one point) and curve. 

There is also an operation “*” called “multiplication”  same as in traditional algebra, kP = P + P + …. + P (k times).

In ECC the public key(K) can be derived from a private key(k),
	K = k * G
where G is the generator point which is not a secret.


### Get Bitcoin Address Using Public Key
Bitcoin address is a string which can be shared with anyone, like your bank account number. It can be generated from the public key using following steps.

1. Create SHA256 hash of the public key
2. Create RIPEMD(RACE Integrity Primitives Evaluation Message Digest) hash of the above hash

A = RIPEMD160(SHA256(K))

### Base58 Encoding

Bitcoin addresses are Base58 encoded for better readability. Base58 is also like Base64 but have omitted often mistype characters like ‘0'‘O’ and ‘I'‘l'‘1'  

Base58 alphabet is as follows

123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz

### Base 58Check Encoding
To add an extra security against typos and transcription errors Bitcoin addresses often use Base58Check encoding.

Base58Check encoding can be done as follows.

1. Append version number to the payload according to the type
2. Hash the versioned payload twice using SHA256 and append first 4 bytes to the original versioned payload
3. Encode using Base58 encoding.

|Type   |Version prefix(hex)   |Base58 result prefix   |
| ------------ | ------------ | ------------ |
|Bitcoin Address   |0x00   |1   |
|Pay-to-Script-Hash-Address   |0x05   |3   |
|Bitcoin Testnet Address   |0x6F   |m or n   |
|Private Key WIF   |0x08   |5, K or L   |
|BIP38 Encrypted   |0x0142   |6P   |
|BIP32 Extended Public Key   |0x0488B21E   |xpub   |

### Key Formats

### Private Key Formats

|Type   |Prefix   |Description   |
| ------------ | ------------ | ------------ |
|Hex   |None   |64 hexadecimal digits   |
|WIF   | 5  |Base58Check encoding: Base-58 with version prefix of 128 and 32-bit checksum   |
|WIF-compressed   |K or L   |As above, with address suffix 0x01 before encoding (Meaning is corresponding public key should be derived as compressed)   |


### Public Key Formats

|Type   |Prefix   |Description   |
| ------------ | ------------ | ------------ |
|Uncompressed   |04   |K = 04 + x + y   |
| Compressed – y is even  |02   |K = 02 + x   |
| Compressed – y is odd  |03   |K = 03 + x   |


------------


### Wallets
Wallet is a simple database that is used to store private keys. There are multiple types of wallets

##### Non-Deterministic (Random) Wallets
Type-0 Non-Deterministic wallets are where every key is independent from each other. So it is very important to manage them all individually. Wallet have to backed up every time a new key pair is created. Non-deterministic wallets may result in funds being inaccessible permanently. Using non-deterministic wallets is discouraged.

##### Deterministic(Seeded) Wallets
Deterministic wallets are wallets that contain keys which are generated from a common seed. Therefor in seeded wallets or deterministic wallets seed can be used to recover the wallet. Backing up seed is sufficient. And also the seed can be used to export keys to another compatible seeded wallet.

##### Mnemonic Code Words BIP0039
Mnemonic words are English word sequence that encodes a random number that is used to create seed.  There are 2048 well chosen words where every word can be distinguished from each other from first four letters. Similar words have been omitted. And word list is sorted so implementations can use binary search instead of linear search which makes the lookup efficient.

Creation of mnemonic code is as follows.

1. Create random sequence of 128 to 256 bits.
2. Create checksum of the sequence by getting the first few bits of the SHA256 hash.
3. Add checksum to the end of the random sequence.
4. Divide sequence into sections of 11 bits.
5. Using those sections as indexes get mnemonic words.

##### Hierarchical Deterministic Wallets BIP0032/BIP0044

###### Conventions Used

- Variables below are either,
	- Integer modulo the order of the curve – n
	- Coordinate point on the curve
	- Byte sequences

- Addition (+) of two coordinate pairs is defined as application of EC Group operation.
- Concatenation (||) is the operation concatenating two byte sequences.

- point(p): returns the coordinate pair resulting from EC point multiplication (repeated application of the EC group operation) of the secp256k1 base point with the integer p.

- ser32(i): serialize a 32-bit unsigned integer i as a 4-byte sequence, most significant byte first.

- ser256(p): serializes the integer p as a 32-byte sequence, most significant byte first.
    
- serP(P): serializes the coordinate pair P = (x,y) as a byte sequence using SEC1's compressed form: (0x02 or 0x03) || ser256(x), where the header byte depends on the parity of the omitted y coordinate.
    
- parse256(p): interprets a 32-byte sequence as a 256-bit number, most significant byte first.

##### Creating HD Wallet from a Seed

HD wallet is created using a single seed, a 128, 256 or 512 bit random number. Every other key can then be created deterministic.

##### Master Key Generation

1. Generate a random seed of 128, 256 or 512 bit sequence from a PRNG.
2. Calculate HMAC-SHA512 hash I of the seed using key as ‘Bitcoin seed’
3. Split the hash into two 32-byte sequences, IL and IR.
4. Use parse256(IL) as the master private key and IR as the master chain cose.

**In case if IL = 0 or IL>=n, master key is INVALID**

##### Child Key Derivation

To derive child keys from a parent key, a seed and an index number is required. Objective of seed is making it impossible to derive further child keys even if keys and index is known. Chain code of the parent key is used as this seed.
Each parent can have 2<sup>32</sup> children, 2<sup>31</sup> non-hardened children and 2<sup>31</sup> hardened children.

##### Extended Keys

Extended key is the combination of key and the corresponding chain code which are essential to derive child keys. We can create both private extended keys and private extended keys.

Private Extended Key :  (k, c) where k is the private key and c is the chain code.
Public  Extended Key : (K, c) where K is the public key and c is the chain code.

##### Hardened Children Vs. Non-hardened (Normal) Children

When deriving non-hardened (normal) children, public key of the parent and the index number is use to create the children.
When deriving hardened children, private key of the parent and the index number is used.
Idea of hardened key is, the corresponding public key of a hardened private key cannot derive from the parent extended public key. Only with the parent extended private key it can be generated.

##### Why Hardened Keys and Non-hardened Keys?

Using same public key for all transactions reveals your privacy. So it is recommended to use different public keys for different transactions. Using non-hardened keys it allows others to make public keys on behalf of us without revealing our private key. This comes handy in a scenario like e-commerce web site. We can accept payment by installing our extended public key in the server, which will generate new public keys for each transaction without compromising the private key.

Ability to derive many child public keys from a extended public key is amazing. But it has a potential risk. Having the extended public key doesn’t give access to child private keys. However since extended public key contains the chain code, if a child private key is known it can be used to derive all other child private keys. Worse, it can be also used to derive the parent private key.
To mitigate this risk ‘hardened keys’ come to play. Hardened child keys use parent private key to create chain code which which breaks the relationship between parent public key and child chain code.

##### Child Key Derivation Functions

As mentioned early, child keys can be derived using both extended private keys and extended public keys.

##### Child Key Derivation Using Private Keys – CKDPriv

The function CKDPriv((kpar, c), I) => (ki, ci) computes child extended private key from the parent extended private key.

- Check whether I >= 2<sup>31</sup>
- If so (hardened child),
I = HMAC_SHA512( key = cpar, data = 0x00 || ser256(kpar) || ser32(i)

- If not (normal child),
I = HMAC-SHA512(key = cpar, data = serp(point(kpar)) || ser32(i)

- Split I into two 32 byte sequences, IL and IR
- Child private key ki is parse256(IL) + kpar (mod n)
- Child chain code ci is IR.
In case if parse256(IL) >= n or ki = 0, the result is invalid. Should proceed with the next I value


##### Child Key Derivation Using Public Keys – CKDPub

The function CKDPub((kpar, c), I) => (Ki, ci) computes child extended public key from the parent extended public key. Can only generate non-hardened child keys.

- Check whether I >= 2<sup>31</sup>
- If so (hardened child),
Raise error

- If not (normal child),
I = HMAC-SHA512(key = cpar, data = serp(point(Kpar)) || ser32(i)

- Split I into two 32 byte sequences, IL and IR
- Child public key Ki is point(parse256(IL) )+ Kpar
- Child chain code ci is IR.

**In case if parse256(IL) >= n or Ki is the point of infinity, the result is invalid. Should proceed with the next I value**


#### Derivation Paths

Each parent extended key can derive about 4 billion children. 2 billion normal children and 2 billion hardened children. And also the tree can be as deep as we want. Because of this extreme flexibility it is difficult to traverse the tree. Specially it is difficult to migrate tree from one wallet to another as we have no idea where to stop deriving further child keys.

Because of that we need a standard structure to derive keys from a HD wallet.

##### Notation

Basic notation describing derivation path of a specific extended key is as follows

m/0/1/3’

The ‘/’ indicates a new level of the derivation tree. Each number is the index of the key at that particular level. “ ’” is to indicate the hardened child without using large numbers. For example given derivation path is for the 4th hardened child of the 2nd normal child of the 1st normal child of the master extended key.

##### BIP0032 Derivation Path (deprecated)
format :
m / account' / external / index

First child is used for specifying **account** and the next two children bellow for separating **external** and **internal** addresses. Children of those are used as the actual key to create addresses.

This is a nice and simple derivation path, but it doesn’t allow for the option of creating alternative derivation path schemes.

##### BIP0044 Derivation Path
format :
m / purpose' / coin_type' / account' / change / address_index

This schema is build upon BIP0032 including a **purpose** which is like a version to identify the upcoming schema as well as **coin type**.  Hence this can be used with multiple cryptocurrencies.


##### BIP0049 Derivation Path
format :
m / purpose' / coin_type' / account' / change / address_index

Uses the same structure as BIP0044 but use 3addresses encoding to encode public keys.

##### BIP0084 Derivation Path
format :
m / purpose' / coin_type' / account' / change / address_index

Uses the same structure as BIP0044 but use bc1addresses encoding to encode public keys.

#### Recovering a Wallet From a Seed

When recovering a wallet from a seed, you should only check the first 20 receiving addresses for a balance. If none have been used in the past, you can consider the account as unused. 

##### Reference:

- BIP 0032 - Hierarchical Deterministic Wallets
https://en.bitcoin.it/wiki/BIP_0032
- BIP 0044 - Multi-Account Hierarchy for Deterministic Wallets
https://en.bitcoin.it/wiki/BIP_0044
- BIP 0039 - Mnemonic code for generating deterministic keys
https://en.bitcoin.it/wiki/BIP_0039
- SEC 2:  Recommended Elliptic Curve Domain Parameters
http://www.secg.org/sec2-v2.pdf
- How do Hierarchical Deterministic Wallets work? | Part 13 Cryptography Crashcourse
https://www.youtube.com/watch?v=nF2l6mdi7Ts

##### Libraries used
- BIP39 - JavaScript implementation of Bitcoin BIP39: Mnemonic code for generating deterministic keys
https://github.com/bitcoinjs/bip39
- BIP32 - A BIP32 compatible library written in TypeScript with transpiled JavaScript committed to git
https://github.com/bitcoinjs/bip32
- Node.js Crypto
https://nodejs.org/api/crypto.html
- csprng - Cryptographically Secure Psuedo Random Number Generator
https://www.npmjs.com/package/csprng