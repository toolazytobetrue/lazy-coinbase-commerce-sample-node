"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUuid = exports.getOrderUrl = exports.logDetails = exports.isEmptyOrNull = void 0;
const logger_1 = __importDefault(require("./logger"));
const moment_1 = __importDefault(require("moment"));
const secrets_1 = require("./secrets");
function isEmptyOrNull(value) {
    return value === undefined || value === null || value === '';
}
exports.isEmptyOrNull = isEmptyOrNull;
function logDetails(errorLevel, errorDescription) {
    const now = moment_1.default(new Date().toISOString());
    const datetime = now.format('YYYY-MM-DD HH:mm:ss ZZ');
    logger_1.default.log(errorLevel, `[${datetime}] ${errorDescription}`);
}
exports.logDetails = logDetails;
function getOrderUrl(uuid) {
    return `${secrets_1.URL_ON_SUCCESS}/orders/${uuid}`;
}
exports.getOrderUrl = getOrderUrl;
function generateUuid() {
    return require('uuid/v1')();
}
exports.generateUuid = generateUuid;
//# sourceMappingURL=utils.js.map