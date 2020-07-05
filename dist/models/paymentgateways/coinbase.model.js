"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coinbaseOrderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.coinbaseOrderSchema = new mongoose_1.default.Schema({
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
//# sourceMappingURL=coinbase.model.js.map