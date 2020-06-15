"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.PasswordResetSchema = new mongoose_1.default.Schema({
    dateCreated: { type: Date, required: true },
    identifier: { type: String, required: true },
    used: { type: Boolean, required: true }
});
exports.PasswordReset = mongoose_1.default.model('PasswordReset', exports.PasswordResetSchema);
//# sourceMappingURL=user-password-reset.js.map