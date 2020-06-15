"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tokenSchema = new mongoose_1.default.Schema({
    token: { type: String, required: true },
    issuer: { type: String, required: true },
    target: { type: String, required: true },
    revoked: { type: Boolean, required: true },
    price: { type: Number, required: true },
    expirationDate: { type: Date, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false }
});
tokenSchema.pre('save', function save(next) {
    const token = this;
    token.lastUpdated = new Date();
    next();
});
exports.Token = mongoose_1.default.model('Token', tokenSchema);
//# sourceMappingURL=token.model.js.map