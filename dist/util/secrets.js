"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COINBASE_WEBHOOK_SECRET = exports.COINBASE_API_KEY = exports.URL_ON_SUCCESS = exports.URL_MAIN = exports.prod = exports.ENVIRONMENT = void 0;
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
exports.URL_MAIN = process.env.NODE_ENV === 'production' && process.env.URL_MAIN ? process.env.URL_MAIN : 'http://localhost:4200';
exports.URL_ON_SUCCESS = process.env.URL_ON_SUCCESS ? process.env.URL_ON_SUCCESS : '';
exports.COINBASE_API_KEY = process.env.COINBASE_API_KEY ? process.env.COINBASE_API_KEY : '';
exports.COINBASE_WEBHOOK_SECRET = process.env.COINBASE_WEBHOOK_SECRET ? process.env.COINBASE_WEBHOOK_SECRET : '';
if (!exports.URL_ON_SUCCESS) {
    logger_1.default.error('URL on fail/on success are missing');
    process.exit(1);
}
if (!exports.COINBASE_WEBHOOK_SECRET || !exports.COINBASE_API_KEY) {
    logger_1.default.error('Coinbase environment variables are missing!');
    process.exit(1);
}
//# sourceMappingURL=secrets.js.map