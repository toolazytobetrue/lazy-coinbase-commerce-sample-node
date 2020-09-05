"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CouponSchema = new mongoose_1.default.Schema({
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    enabled: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
CouponSchema.pre('save', function save(next) {
    const coupon = this;
    coupon.lastUpdated = new Date();
    next();
});
exports.Coupon = mongoose_1.default.model('Coupon', CouponSchema);
//# sourceMappingURL=coupon.model.js.map