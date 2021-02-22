var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64UrlDecode = exports.base64UrlEncode = exports.checkVpMetaData = exports.checkVcMetaData = exports.verifyVpSignature = exports.verifyVcSignature = exports.verifyVC = exports.verify = exports.present = exports.issue = void 0;
var secp256k1_1 = require("secp256k1");
var sha_js_1 = __importDefault(require("sha.js"));
var utils_1 = require("./utils");
var ethereum_public_key_to_address_1 = __importDefault(require("ethereum-public-key-to-address"));
function issue(claims, signerPrivateKey, holderPublicKey) {
    var maskedClaims = {};
    for (var key in claims) {
        try {
            var maskedKey = utils_1.blind(key, holderPublicKey);
            maskedClaims[maskedKey] = utils_1.blind(claims[key], holderPublicKey);
        }
        catch (error) {
            throw Error("Masking failed\n" + error.message);
        }
    }
    var sortedClaimString = JSON.stringify(maskedClaims, Object.keys(maskedClaims).sort());
    var claimStringHash = new sha_js_1.default.sha256().update(sortedClaimString).digest('hex');
    var claimHashBuffer = Buffer.from(claimStringHash, 'hex');
    var signerPrivateKeyBuffer = Buffer.from(signerPrivateKey, 'hex');
    var signerPublicKeyBuffer = Buffer.from(secp256k1_1.publicKeyCreate(signerPrivateKeyBuffer));
    var signerPublicKey = signerPublicKeyBuffer.toString('hex');
    var signerDID = "did:ethr:" + ethereum_public_key_to_address_1.default(signerPublicKey);
    var holderDID = "did:ethr:" + ethereum_public_key_to_address_1.default(holderPublicKey);
    var proof = utils_1.base64UrlEncode(JSON.stringify(secp256k1_1.ecdsaSign(claimHashBuffer, signerPrivateKeyBuffer)));
    var mask = {};
    var vc = {
        type: "VerifiableCredential",
        issuer: {
            did: signerDID,
            publicKey: signerPublicKey
        },
        subject: {
            did: holderDID,
            publicKey: holderPublicKey
        },
        claims: claims,
        proof: proof,
        mask: mask
    };
    return vc;
}
exports.issue = issue;
function present(credentials, masks, holderPrivateKey) {
    var maskedCredentials = [];
    var holderPrivateKeyBuffer = Buffer.from(holderPrivateKey, 'hex');
    var holderPublicKeyBuffer = Buffer.from(secp256k1_1.publicKeyCreate(holderPrivateKeyBuffer));
    var holderPublicKey = holderPublicKeyBuffer.toString('hex');
    for (var index = 0; index < credentials.length; index++) {
        var item = credentials[index];
        var claims = item.claims;
        var mask = masks[index];
        var maskedClaims = {};
        for (var key in claims) {
            if (mask[key] !== true) {
                maskedClaims[key] = claims[key];
            }
        }
        var maskedMask = {};
        for (var key in mask) {
            if (mask[key]) {
                if (claims[key]) {
                    try {
                        var maskedKey = utils_1.blind(key, holderPublicKey);
                        var maskedValue = utils_1.blind(claims[key], holderPublicKey);
                        maskedClaims[maskedKey] = maskedValue;
                        maskedMask[maskedKey] = true;
                    }
                    catch (error) {
                        throw Error("Masking failed\n" + error.message);
                    }
                }
            }
        }
        var maskedCredential = __assign(__assign({}, item), { claims: maskedClaims, mask: maskedMask });
        maskedCredentials.push(maskedCredential);
    }
    var maskedCredentialString = JSON.stringify(maskedCredentials);
    var credentialHash = new sha_js_1.default.sha256().update(maskedCredentialString).digest('hex');
    var credentialsHashBuffer = Buffer.from(credentialHash, 'hex');
    var proof = utils_1.base64UrlEncode(JSON.stringify(secp256k1_1.ecdsaSign(credentialsHashBuffer, holderPrivateKeyBuffer)));
    var derivedDID = ethereum_public_key_to_address_1.default(holderPublicKey);
    var presentation = {
        subject: {
            did: "did:ethr:" + derivedDID,
            publicKey: holderPublicKey
        },
        type: "VerifiablePresentation",
        credentials: maskedCredentials,
        proof: proof
    };
    return presentation;
}
exports.present = present;
function verify(vp, signerPublicKeys, holderPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, proof, _i, credentials_1, vc, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkVpMetaData(vp);
                    credentials = vp.credentials, proof = vp.proof;
                    _i = 0, credentials_1 = credentials;
                    _a.label = 1;
                case 1:
                    if (!(_i < credentials_1.length)) return [3 /*break*/, 8];
                    vc = credentials_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, , 7]);
                    if (!signerPublicKeys.includes(vc.issuer.publicKey)) return [3 /*break*/, 4];
                    return [4 /*yield*/, verifyVC(vc, vc.issuer.publicKey, holderPublicKey)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: throw Error(utils_1.ERRORS.INVALID_ISSUER_PUBLIC_KEY);
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    throw Error("At least one credential is not valid\n" + e_1.message);
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, verifyVpSignature(credentials, proof, holderPublicKey)];
            }
        });
    });
}
exports.verify = verify;
function verifyVC(vc, signerPublicKey, holderPublicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var claims, proof, mask;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkVcMetaData(vc);
                    claims = vc.claims, proof = vc.proof, mask = vc.mask;
                    return [4 /*yield*/, utils_1.resolveIdentity(vc.issuer.did, signerPublicKey)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, verifyVcSignature(claims, mask, proof, signerPublicKey, holderPublicKey)];
            }
        });
    });
}
exports.verifyVC = verifyVC;
function verifyVcSignature(claims, mask, proof, signerPublicKey, holderPublicKey) {
    mask = mask || {};
    var maskedClaims = {};
    for (var key in claims) {
        if (!mask[key]) {
            if (claims[key]) {
                try {
                    var maskedKey = utils_1.blind(key, holderPublicKey);
                    maskedClaims[maskedKey] = utils_1.blind(claims[key], holderPublicKey);
                }
                catch (error) {
                    throw Error("Masking failed\n" + error.message);
                }
            }
        }
        else {
            maskedClaims[key] = claims[key];
        }
    }
    var sortedClaimString = JSON.stringify(maskedClaims, Object.keys(maskedClaims).sort());
    var claimStringHash = new sha_js_1.default.sha256().update(sortedClaimString).digest('hex');
    var claimHashBuffer = Buffer.from(claimStringHash, 'hex');
    var signerPublicKeyBuffer = Buffer.from(signerPublicKey, 'hex');
    try {
        var signatureObject_1 = JSON.parse(utils_1.base64UrlDecode(proof)).signature;
        var signatureArray = Uint8Array.from(Object.keys(signatureObject_1).map(function (key) { return signatureObject_1[key]; }));
        var signature = secp256k1_1.ecdsaVerify(signatureArray, claimHashBuffer, signerPublicKeyBuffer);
        if (!signature) {
            throw Error(utils_1.ERRORS.NO_PROOF_VC);
        }
        else {
            return true;
        }
    }
    catch (error) {
        throw Error(utils_1.ERRORS.NO_PROOF_VC + "\n" + error.message);
    }
}
exports.verifyVcSignature = verifyVcSignature;
function verifyVpSignature(credentials, proof, holderPublicKey) {
    var credentialString = JSON.stringify(credentials);
    var credentialHash = new sha_js_1.default.sha256().update(credentialString).digest('hex');
    var credentialsHashBuffer = Buffer.from(credentialHash, 'hex');
    var holderPublicKeyBuffer = Buffer.from(holderPublicKey, 'hex');
    try {
        var signatureObject_2 = JSON.parse(utils_1.base64UrlDecode(proof)).signature;
        var signatureArray = Uint8Array.from(Object.keys(signatureObject_2).map(function (key) { return signatureObject_2[key]; }));
        var signature = secp256k1_1.ecdsaVerify(signatureArray, credentialsHashBuffer, holderPublicKeyBuffer);
        if (!signature) {
            throw Error(utils_1.ERRORS.NO_PROOF_VP);
        }
        else {
            return true;
        }
    }
    catch (error) {
        throw Error(utils_1.ERRORS.NO_PROOF_VP + "\n" + error.message);
    }
}
exports.verifyVpSignature = verifyVpSignature;
function checkVcMetaData(vc) {
    var issuer = vc.issuer, subject = vc.subject, type = vc.type, claims = vc.claims, proof = vc.proof;
    if (!proof) {
        throw new Error(utils_1.ERRORS.NO_PROOF_VC);
    }
    if (!issuer) {
        throw new Error(utils_1.ERRORS.NO_ISSUER);
    }
    if (type !== 'VerifiableCredential') {
        throw new Error(utils_1.ERRORS.TYPE_NOT_VALID);
    }
    else if (!issuer.did) {
        throw new Error(utils_1.ERRORS.NO_ISSUER_DID);
    }
    else if (!issuer.publicKey) {
        throw new Error(utils_1.ERRORS.NO_ISSUER_PUBLIC_KEY);
    }
    if (!subject) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT);
    }
    else if (!subject.did) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT_DID);
    }
    else if (!subject.publicKey) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT_PUBLIC_KEY);
    }
    if (!claims) {
        throw new Error(utils_1.ERRORS.NO_CLAIMS);
    }
}
exports.checkVcMetaData = checkVcMetaData;
function checkVpMetaData(vp) {
    var subject = vp.subject, credentials = vp.credentials, type = vp.type, proof = vp.proof;
    if (!proof) {
        throw new Error(utils_1.ERRORS.NO_PROOF_VC);
    }
    if (!subject) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT);
    }
    if (type !== 'VerifiablePresentation') {
        throw new Error(utils_1.ERRORS.TYPE_NOT_VALID);
    }
    else if (!subject.did) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT_DID);
    }
    else if (!subject.publicKey) {
        throw new Error(utils_1.ERRORS.NO_SUBJECT_PUBLIC_KEY);
    }
    if (!credentials) {
        throw new Error(utils_1.ERRORS.NO_CREDENTIALS);
    }
    else if (credentials.length < 1) {
        throw new Error(utils_1.ERRORS.NO_CREDENTIALS);
    }
}
exports.checkVpMetaData = checkVpMetaData;
var utils_2 = require("./utils");
Object.defineProperty(exports, "base64UrlEncode", { enumerable: true, get: function () { return utils_2.base64UrlEncode; } });
Object.defineProperty(exports, "base64UrlDecode", { enumerable: true, get: function () { return utils_2.base64UrlDecode; } });
