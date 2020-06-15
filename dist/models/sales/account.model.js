"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AccountSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    stats: [String],
    points: [String],
    price: { type: Number, required: true },
    sold: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});
AccountSchema.pre('save', function save(next) {
    const account = this;
    account.lastUpdated = new Date();
    next();
});
exports.Account = mongoose_1.default.model('Account', AccountSchema);
//# sourceMappingURL=account.model.js.map