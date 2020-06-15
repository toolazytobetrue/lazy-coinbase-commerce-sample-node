"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const jwt = __importStar(require("jsonwebtoken"));
exports.privateKey = fs.readFileSync('bert.key');
exports.pubKey = fs.readFileSync('bert.key.pub');
const verifyOptions = {
    algorithm: 'RS256',
    audience: 'bert',
    expiresIn: '12h',
    issuer: 'bertserver',
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