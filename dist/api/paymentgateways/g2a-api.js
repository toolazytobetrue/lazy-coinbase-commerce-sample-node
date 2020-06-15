"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const request_promise_1 = __importDefault(require("request-promise"));
const secrets_1 = require("../../util/secrets");
function createG2APayment(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        var options = {
            method: 'POST',
            uri: `${secrets_1.G2A_CHECKOUT_URL}/index/createQuote`,
            form: payload
        };
        return yield request_promise_1.default(options);
    });
}
exports.createG2APayment = createG2APayment;
function getG2APayment(transactionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var options = {
            method: 'GET',
            uri: `${secrets_1.G2A_REST_URL}/transactions/${transactionId}`,
            headers: {
                Authorization: {
                    apiHash: secrets_1.G2A_API_HASH,
                    hash: getG2AAuthHash(secrets_1.G2A_API_HASH, secrets_1.MERCHANT_EMAIL, secrets_1.G2A_API_SECRET),
                },
            }
        };
        return yield request_promise_1.default(options);
    });
}
exports.getG2APayment = getG2APayment;
function refundG2APayment(transactionId, userOrderId, amount, refundedAmount) {
    return __awaiter(this, void 0, void 0, function* () {
        const calculatedHash = getG2ARefundHash(transactionId, userOrderId, amount, refundedAmount, secrets_1.G2A_API_SECRET);
        const options = {
            method: 'PUT',
            uri: `${secrets_1.G2A_REST_URL}/transactions/${transactionId}?action=refund&amount=${amount}&hash=${calculatedHash}`,
            headers: {
                Authorization: {
                    apiHash: secrets_1.G2A_API_HASH,
                    authHash: getG2AAuthHash(secrets_1.G2A_API_HASH, secrets_1.MERCHANT_EMAIL, secrets_1.G2A_API_SECRET),
                },
            },
        };
        return yield request_promise_1.default(options);
    });
}
exports.refundG2APayment = refundG2APayment;
function getG2AOrderHash(userOrderId, amount, currency, apiSecret) {
    return crypto.createHmac('sha256', `${userOrderId}${amount}${currency}${apiSecret}`).digest('hex');
}
exports.getG2AOrderHash = getG2AOrderHash;
function getG2AAuthHash(apiHash, merchantEmail, apiSecret) {
    return crypto.createHmac('sha256', `${apiHash}${merchantEmail}${apiSecret}`).digest('hex');
}
exports.getG2AAuthHash = getG2AAuthHash;
function getG2ARefundHash(transactionId, userOrderId, amount, refundedAmount, apiSecret) {
    return crypto.createHmac('sha256', `${transactionId}${userOrderId}${amount}${refundedAmount}${apiSecret}`).digest('hex');
}
exports.getG2ARefundHash = getG2ARefundHash;
function getG2AIPNHash(transactionId, userOrderId, amount, apiSecret = secrets_1.G2A_API_SECRET) {
    return crypto.createHash('sha256').update(`${transactionId}${userOrderId}${amount}${apiSecret}`).digest('hex');
}
exports.getG2AIPNHash = getG2AIPNHash;
//# sourceMappingURL=g2a-api.js.map