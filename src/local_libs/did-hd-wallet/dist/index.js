"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createETHDIDFromPrivateKey = exports.createRandomETHDID = exports.getDID = exports.publicKeyToETH = exports.getSeedFromMnemonic = exports.validateMnemonic = exports.generateMnemonic = exports.Types = void 0;
var bip39 = __importStar(require("bip39"));
var bip32 = __importStar(require("bip32"));
var ethereum_public_key_to_address_1 = __importDefault(require("ethereum-public-key-to-address"));
var ethr_did_1 = __importDefault(require("ethr-did"));
var web3_1 = __importDefault(require("web3"));
var Types;
(function (Types) {
    Types[Types["SEED"] = 0] = "SEED";
    Types[Types["MNEMONIC"] = 1] = "MNEMONIC";
    Types[Types["WIF"] = 2] = "WIF";
    Types[Types["BASE58"] = 3] = "BASE58";
})(Types = exports.Types || (exports.Types = {}));
var w3 = new web3_1.default();
var Wallet = /** @class */ (function () {
    function Wallet(type, value) {
        switch (type) {
            case (Types.SEED): {
                this.mnemonic = undefined;
                this.masterNode = bip32.fromSeed(Buffer.from(value, 'hex'));
                break;
            }
            case (Types.MNEMONIC): {
                this.mnemonic = value;
                try {
                    var seed = getSeedFromMnemonic(value);
                    this.masterNode = bip32.fromSeed(Buffer.from(seed, 'hex'));
                }
                catch (e) {
                    throw Error(e);
                }
                break;
            }
            case (Types.BASE58): {
                this.mnemonic = undefined;
                this.masterNode = bip32.fromBase58(value);
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
    Wallet.prototype.getMasterKeys = function () {
        var _a;
        var privateKey = (_a = this.masterNode.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
        var chainCode = this.masterNode.chainCode.toString('hex');
        var publicKey = this.masterNode.publicKey.toString('hex');
        var base58 = this.masterNode.toBase58();
        var wif = this.masterNode.toWIF();
        var ethAddress = publicKeyToETH(publicKey);
        var did = getDID(ethAddress);
        return { privateKey: privateKey, publicKey: publicKey, chainCode: chainCode, ethAddress: ethAddress, did: did };
    };
    Wallet.prototype.getMasterPrivateKey = function () {
        var _a;
        return (_a = this.masterNode.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
    };
    Wallet.prototype.getMasterPublicKey = function () {
        return this.masterNode.publicKey.toString('hex');
    };
    Wallet.prototype.getMasterChainCode = function () {
        return this.masterNode.chainCode.toString('hex');
    };
    Wallet.prototype.getMasterMnemonic = function () {
        return this.mnemonic;
    };
    Wallet.prototype.getChildKeys = function (path) {
        var _a;
        try {
            var childNode = this.masterNode.derivePath(path);
            var privateKey = (_a = childNode.privateKey) === null || _a === void 0 ? void 0 : _a.toString('hex');
            var chainCode = childNode.chainCode.toString('hex');
            var publicKey = childNode.publicKey.toString('hex');
            var base58 = childNode.toBase58();
            var wif = childNode.toWIF();
            var ethAddress = publicKeyToETH(publicKey);
            var did = getDID(ethAddress);
            return { privateKey: privateKey, publicKey: publicKey, chainCode: chainCode, base58: base58, wif: wif, ethAddress: ethAddress, did: did };
        }
        catch (e) {
            throw Error(e);
        }
    };
    Wallet.prototype.getBase58 = function () {
        return this.masterNode.toBase58();
    };
    Wallet.prototype.getWIF = function () {
        return this.masterNode.toWIF();
    };
    return Wallet;
}());
exports.default = Wallet;
function generateMnemonic(strength) {
    var mnemonic = bip39.generateMnemonic(strength);
    return mnemonic;
}
exports.generateMnemonic = generateMnemonic;
function validateMnemonic(mnemonic) {
    return bip39.validateMnemonic(mnemonic);
}
exports.validateMnemonic = validateMnemonic;
function getSeedFromMnemonic(mnemonic) {
    if (validateMnemonic(mnemonic)) {
        try {
            var seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
            return seed;
        }
        catch (e) {
            throw Error(e);
        }
    }
    else {
        throw Error('Not a valid mnemonic');
    }
}
exports.getSeedFromMnemonic = getSeedFromMnemonic;
function publicKeyToETH(publicKey) {
    var ethAddress = ethereum_public_key_to_address_1.default(publicKey);
    return ethAddress;
}
exports.publicKeyToETH = publicKeyToETH;
function getDID(address) {
    return "did:ethr:" + address;
}
exports.getDID = getDID;
function createRandomETHDID() {
    var acc = w3.eth.accounts.create();
    var ethrDid = new ethr_did_1.default({ address: acc.address, privateKey: acc.privateKey });
    return { privateKey: acc.privateKey.replace('0x', ''), did: ethrDid.did };
}
exports.createRandomETHDID = createRandomETHDID;
function createETHDIDFromPrivateKey(privateKey) {
    var acc = w3.eth.accounts.privateKeyToAccount(privateKey);
    var ethrDid = new ethr_did_1.default({ address: acc.address, privateKey: acc.privateKey });
    return { privateKey: acc.privateKey.replace('0x', ''), did: ethrDid.did };
}
exports.createETHDIDFromPrivateKey = createETHDIDFromPrivateKey;
