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
exports.Order = exports.OrderSchema = exports.Gold = exports.GoldSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const payment_gateway_model_1 = require("../entities/payment-gateway.model");
const coupon_model_1 = require("../sales/coupon.model");
const coinbase_model_1 = require("../paymentgateways/coinbase.model");
const stock_model_1 = require("../sales/stock.model");
const account_model_1 = require("../sales/account.model");
const serviceminigame_model_1 = require("../sales/serviceminigame.model");
const powerleveling_model_1 = require("../sales/powerleveling.model");
exports.GoldSchema = new mongoose_1.default.Schema({
    units: { type: Number, required: true },
    server: { type: Number, required: true },
    stock: { type: stock_model_1.Stock.schema, required: true },
    rsn: { type: String, required: true },
});
exports.Gold = mongoose_1.default.model('Gold', exports.GoldSchema);
exports.OrderSchema = new mongoose_1.default.Schema({
    uuid: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    paymentGateway: { type: payment_gateway_model_1.PaymentGateway.schema, required: true },
    delivered: { type: Boolean, required: true },
    status: { type: String, required: true },
    payment: {
        coinbase: { type: coinbase_model_1.coinbaseOrderSchema, required: false }
    },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
    coupon: { type: coupon_model_1.Coupon.schema, required: false },
    ipAddress: { type: String, required: false },
    gold: { type: exports.Gold.schema, required: false },
    accounts: { type: [account_model_1.Account.schema], required: false },
    services: { type: [serviceminigame_model_1.ServiceMinigame.schema], required: false },
    powerleveling: { type: [powerleveling_model_1.Powerleveling.schema], required: false }
});
exports.OrderSchema.pre('save', function save(next) {
    const order = this;
    order.lastUpdated = new Date();
    next();
});
exports.Order = mongoose_1.default.model('Order', exports.OrderSchema);
//# sourceMappingURL=order.model.js.map