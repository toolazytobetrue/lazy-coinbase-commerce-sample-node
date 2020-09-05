"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapRate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SwapRateSchema = new mongoose_1.default.Schema({
    give: { type: Number, required: true },
    take: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
SwapRateSchema.pre('save', function save(next) {
    const SwapRate = this;
    SwapRate.lastUpdated = new Date();
    next();
});
exports.SwapRate = mongoose_1.default.model('SwapRate', SwapRateSchema);
//# sourceMappingURL=swap.model copy.js.map