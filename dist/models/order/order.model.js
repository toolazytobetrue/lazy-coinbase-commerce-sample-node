"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const payment_gateway_model_1 = require("../entities/payment-gateway.model");
const account_model_1 = require("../sales/account.model");
const gold_model_1 = require("../sales/gold.model");
const powerleveling_model_1 = require("../sales/powerleveling.model");
const serviceminigame_model_1 = require("../sales/serviceminigame.model");
const coupon_model_1 = require("../sales/coupon.model");
const coinbaseOrderSchema = new mongoose_1.default.Schema({
    identifier: { type: String, required: true },
    code: { type: String, required: true },
    timeline: [
        {
            time: { type: Date, required: true },
            status: { type: String, required: true },
            context: { type: String, required: false }
        },
    ],
    payments: [
        {
            status: String,
            local: { amount: Number, currency: String },
            crypto: { amount: Number, currency: String }
        }
    ]
});
const OrderSchema = new mongoose_1.default.Schema({
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    paymentGateway: { type: payment_gateway_model_1.PaymentGateway.schema, required: true },
    amount: { type: Number, required: true },
    amountWithDiscount: { type: Number, required: true },
    payout: { type: Number, required: false },
    delivered: { type: Boolean, required: true },
    rsn: { type: String, required: false },
    status: { type: String, required: true },
    payment: {
        coinbase: { type: coinbaseOrderSchema, required: false }
    },
    account: { type: account_model_1.Account.schema, required: false },
    gold: { type: gold_model_1.Gold.schema, required: false },
    services: [serviceminigame_model_1.ServiceMinigame.schema],
    powerleveling: [powerleveling_model_1.Powerleveling.schema],
    requests: [
        {
            worker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
            dateCreated: { type: Date, required: true }
        }
    ],
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
    coupon: { type: coupon_model_1.Coupon.schema, required: false },
    ipAddress: { type: String, required: false }
});
OrderSchema.pre('save', function save(next) {
    const order = this;
    order.lastUpdated = new Date();
    next();
});
exports.Order = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=order.model.js.map