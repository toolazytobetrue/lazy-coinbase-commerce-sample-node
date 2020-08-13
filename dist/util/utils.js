"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRSN = exports.getOrderUrl = exports.isDbObjectId = exports.getOptionalAuthorizedUser = exports.deepClone = exports.generateUuid = exports.isAuthorizedJwt = exports.isAllowedOrderRange = exports.getAuthorizedUser = exports.logDetails = exports.generateText = exports.getAuthorization = exports.isEmptyOrNullParams = exports.isEmptyOrNull = void 0;
const jwt_helper_1 = require("./jwt-helper");
const logger_1 = __importDefault(require("./logger"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("./secrets");
function isEmptyOrNull(value) {
    return value === undefined || value === null || value === '';
}
exports.isEmptyOrNull = isEmptyOrNull;
function isEmptyOrNullParams(value) {
    return value === 'undefined' || value === undefined || value === null || value === '';
}
exports.isEmptyOrNullParams = isEmptyOrNullParams;
function getAuthorization(req) {
    // tslint:disable-next-line:max-line-length
    const headers = req.headers.authorization ? typeof req.headers.authorization === 'string' ? req.headers.authorization : req.headers.authorization[0] : null;
    if (headers === null) {
        return null;
    }
    if (!headers.includes('Bearer ')) {
        return null;
    }
    const headersParsed = headers.trim().split('Bearer ');
    if (headersParsed.length === 2) {
        return headersParsed[1];
    }
    else {
        return null;
    }
}
exports.getAuthorization = getAuthorization;
function generateText(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateText = generateText;
function logDetails(errorLevel, errorDescription) {
    const now = moment_1.default(new Date().toISOString());
    const datetime = now.format('YYYY-MM-DD HH:mm:ss ZZ');
    logger_1.default.log(errorLevel, `[${datetime}] ${errorDescription}`);
}
exports.logDetails = logDetails;
function getAuthorizedUser(req, res, next) {
    const token = getAuthorization(req);
    if (!token) {
        return null;
    }
    return jwt_helper_1.decodeToken(token);
}
exports.getAuthorizedUser = getAuthorizedUser;
function isAllowedOrderRange(min, max, input) {
    if (min !== -1 && max !== -1) {
        return input >= min && input <= max && input > 0;
    }
    if (min === -1 && max !== -1) {
        return input <= max && input > 0;
    }
    if (min !== -1 && max === -1) {
        return input >= min && input > 0;
    }
    if (min === -1 && max === -1) {
        return input > 0;
    }
}
exports.isAllowedOrderRange = isAllowedOrderRange;
function isAuthorizedJwt(token) {
    return new Promise((resovle, reject) => {
        if (isEmptyOrNull(token)) {
            return reject("Token cannot be empty");
        }
        jwt_helper_1.verifyData(token, (err, decoded) => {
            if (err) {
                return reject('Error parsing jwt');
            }
            if (decoded.exp !== undefined && decoded.exp !== null && decoded.exp - Math.floor(new Date().getTime() / 1000) > 0) {
                return resovle(decoded);
            }
            else {
                return reject('Token expired, please re-login');
            }
        });
    });
}
exports.isAuthorizedJwt = isAuthorizedJwt;
function generateUuid() {
    const uuidv1 = require('uuid/v1');
    return uuidv1();
}
exports.generateUuid = generateUuid;
function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
}
exports.deepClone = deepClone;
function getOptionalAuthorizedUser(req, res, next) {
    const token = getAuthorization(req);
    if (!token) {
        return null;
    }
    return jwt_helper_1.decodeToken(token);
}
exports.getOptionalAuthorizedUser = getOptionalAuthorizedUser;
function isDbObjectId(input) {
    return mongoose_1.default.isValidObjectId(input);
}
exports.isDbObjectId = isDbObjectId;
function getOrderUrl(orderId) {
    return `${secrets_1.URL_ON_SUCCESS}/orders/${orderId}`;
}
exports.getOrderUrl = getOrderUrl;
function checkRSN(input) {
    const rsnRegex = new RegExp(`[a-zA-Z0-9_-]$`);
    return rsnRegex.test(input);
}
exports.checkRSN = checkRSN;
//# sourceMappingURL=utils.js.map