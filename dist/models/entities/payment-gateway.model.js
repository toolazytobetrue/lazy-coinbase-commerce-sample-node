"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGateway = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const paymentGatewaySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    lastUpdated: Date,
    dateCreated: Date,
    enabled: { type: Boolean, required: true },
    requiresLogin: { type: Boolean, required: true },
    fees: { type: Number, required: true }
});
paymentGatewaySchema.pre('save', function save(next) {
    const paymentGateway = this;
    paymentGateway.lastUpdated = new Date();
    next();
});
exports.PaymentGateway = mongoose_1.default.model('PaymentGateway', paymentGatewaySchema);
//# sourceMappingURL=payment-gateway.model.js.map