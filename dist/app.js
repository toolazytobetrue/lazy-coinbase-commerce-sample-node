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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = exports.Client = exports.Charge = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index = __importStar(require("./controllers/index"));
const secrets_1 = require("./util/secrets");
const coinbase = __importStar(require("coinbase-commerce-node"));
const webhookCoinbase = __importStar(require("./controllers/webhooks/coinbase"));
const orderController = __importStar(require("./controllers/order/order"));
const app = express_1.default();
app.use(cors_1.default());
exports.Charge = coinbase.resources.Charge;
exports.Client = coinbase.Client;
exports.Webhook = coinbase.Webhook;
exports.Client.init(secrets_1.COINBASE_API_KEY);
app.set('port', process.env.PORT || 3000);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', index.index);
/**
 * Order
 */
app.post('/api/order', orderController.createOrder);
/**
 * Payment Webhooks API endpoints
 */
app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);
exports.default = app;
//# sourceMappingURL=app.js.map