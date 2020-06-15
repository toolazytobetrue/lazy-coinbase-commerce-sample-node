"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserEmailSchema = new mongoose_1.default.Schema({
    dateCreated: { type: Date, required: true },
    identifier: { type: String, required: true },
    email: { type: String, required: true },
    activated: { type: Boolean, required: true },
});
exports.UserEmail = mongoose_1.default.model('UserEmail', exports.UserEmailSchema);
//# sourceMappingURL=user-email.js.map