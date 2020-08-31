"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const account_addon_1 = require("./account-addon");
const AccountSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    type: { type: Number, required: true },
    stock: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    allowedAddons: [{ type: account_addon_1.AccountAddon.schema, required: true }],
});
AccountSchema.pre('save', function save(next) {
    const account = this;
    account.lastUpdated = new Date();
    next();
});
exports.Account = mongoose_1.default.model('Account', AccountSchema);
//# sourceMappingURL=account.model.js.map