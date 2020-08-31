"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAddon = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AccountAddonSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});
AccountAddonSchema.pre('save', function save(next) {
    const addon = this;
    addon.lastUpdated = new Date();
    next();
});
exports.AccountAddon = mongoose_1.default.model('AccountAddon', AccountAddonSchema);
//# sourceMappingURL=account-addon.js.map