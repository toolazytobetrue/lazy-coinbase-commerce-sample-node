"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBSITE_EMAIL_PASSWORD = exports.WEBSITE_EMAIL = exports.WEBSITE_SUPPORT_NAME = exports.WEBSITE_NAME = exports.COINBASE_WEBHOOK_SECRET = exports.COINBASE_API_KEY = exports.REDIS_PASSWORD = exports.MERCHANT_EMAIL = exports.URL_ON_SUCCESS = exports.URL_ON_FAIL = exports.URL_MAIN = exports.MONGODB_URI = exports.prod = exports.ENVIRONMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
if (fs_1.default.existsSync('.env')) {
    dotenv_1.default.config({ path: '.env' });
}
else {
    logger_1.default.error('.env required to run the app.');
    process.exit(1);
}
if (process.env.NODE_ENV !== 'production') {
    logger_1.default.debug('Logging initialized at debug level');
}
exports.ENVIRONMENT = process.env.NODE_ENV;
exports.prod = exports.ENVIRONMENT === 'production'; // Anything else is treated as 'dev'
exports.MONGODB_URI = exports.prod ? process.env.MONGODB_URI : process.env.MONGODB_URI_LOCAL;
if (!exports.MONGODB_URI) {
    if (exports.prod) {
        logger_1.default.error('No mongo connection string. Set MONGODB_URI environment variable.');
    }
    else {
        logger_1.default.error('No mongo connection string. Set MONGODB_URI_LOCAL environment variable.');
    }
}
exports.URL_MAIN = process.env.NODE_ENV === 'production' && process.env.URL_MAIN ? process.env.URL_MAIN : 'http://localhost:4200';
exports.URL_ON_FAIL = process.env.URL_ON_FAIL ? process.env.URL_ON_FAIL : '';
exports.URL_ON_SUCCESS = process.env.URL_ON_SUCCESS ? process.env.URL_ON_SUCCESS : '';
exports.MERCHANT_EMAIL = process.env.MERCHANT_EMAIL ? process.env.MERCHANT_EMAIL : '';
exports.REDIS_PASSWORD = process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : '';
exports.COINBASE_API_KEY = process.env.COINBASE_API_KEY ? process.env.COINBASE_API_KEY : '';
exports.COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET ? process.env.COINBASE_WEBHOOK_SECRET : '';
if (!exports.URL_ON_FAIL || !exports.URL_ON_SUCCESS) {
    logger_1.default.error('URL on fail/on success are missing');
    process.exit(1);
}
if (!exports.COINBASE_WEBHOOK_SECRET || !exports.COINBASE_API_KEY) {
    logger_1.default.error('Coinbase environment variables are missing!');
    process.exit(1);
}
exports.WEBSITE_NAME = process.env.WEBSITE_NAME ? process.env.WEBSITE_NAME : '';
exports.WEBSITE_SUPPORT_NAME = process.env.WEBSITE_SUPPORT_NAME ? process.env.WEBSITE_SUPPORT_NAME : '';
exports.WEBSITE_EMAIL = process.env.WEBSITE_EMAIL ? process.env.WEBSITE_EMAIL : '';
exports.WEBSITE_EMAIL_PASSWORD = process.env.WEBSITE_EMAIL_PASSWORD ? process.env.WEBSITE_EMAIL_PASSWORD : '';
//# sourceMappingURL=secrets.js.map