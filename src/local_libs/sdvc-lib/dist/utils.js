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
exports.ERRORS = exports.resolveIdentity = exports.blind = exports.base64UrlDecode = exports.base64UrlEncode = void 0;
var hashUtils = __importStar(require("hash.js"));
var axios_1 = __importDefault(require("axios"));
var ethereum_public_key_to_address_1 = __importDefault(require("ethereum-public-key-to-address"));
function base64UrlEncode(unencoded) {
    return Buffer.from(unencoded).toString('base64').replace('+', '-').replace('/', '_').replace(/=+$/, '');
}
exports.base64UrlEncode = base64UrlEncode;
function base64UrlDecode(encoded) {
    encoded = encoded.replace('-', '+').replace('_', '/');
    while (encoded.length % 4) {
        encoded += '=';
    }
    return Buffer.from(encoded, 'base64').toString('utf8');
}
exports.base64UrlDecode = base64UrlDecode;
function blind(data, key) {
    var sha256 = hashUtils.sha256();
    var blinded = sha256.update(data + key).digest('hex');
    return blinded;
}
exports.blind = blind;
function resolveIdentity(did, publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var response, result, derivedDID, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get('https://dev.uniresolver.io/1.0/identifiers/' + did)];
                case 1:
                    response = _a.sent();
                    result = response.data['didDocument'];
                    if (result &&
                        result.id == did &&
                        result.authentication &&
                        result.authentication.length > 0) {
                        derivedDID = ethereum_public_key_to_address_1.default(publicKey);
                        if ("did:ethr:" + derivedDID === did) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error(exports.ERRORS.DID_PUBLIC_KEY_MISMATCH);
                        }
                    }
                    else {
                        throw new Error(exports.ERRORS.INVALID_DOCUMENT);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    throw new Error(e_1.message);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.resolveIdentity = resolveIdentity;
exports.ERRORS = Object.freeze({
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
});
