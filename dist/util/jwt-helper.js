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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.verifyData = exports.signData = exports.pubKey = exports.privateKey = void 0;
const fs = __importStar(require("fs"));
const jwt = __importStar(require("jsonwebtoken"));
exports.privateKey = fs.readFileSync('monkeysgold.key');
exports.pubKey = fs.readFileSync('monkeysgold.key.pub');
const verifyOptions = {
    algorithm: 'RS256',
    audience: 'monkeysgold',
    expiresIn: '12h',
    issuer: 'monkeysgoldserver',
    subject: 'credentials',
};
function signData(data, cb) {
    jwt.sign(data, exports.privateKey, verifyOptions, (err, token) => {
        cb(err, token);
    });
}
exports.signData = signData;
function verifyData(input, cb) {
    jwt.verify(input, exports.pubKey, verifyOptions, (err, decoded) => {
        cb(err, decoded);
    });
}
exports.verifyData = verifyData;
function decodeToken(token) {
    return jwt.decode(token);
}
exports.decodeToken = decodeToken;
//# sourceMappingURL=jwt-helper.js.map