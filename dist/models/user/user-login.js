"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.UserLoginSchema = new mongoose_1.default.Schema({
    dateCreated: { type: Date, required: true },
    ip: { type: String, required: true }
});
//# sourceMappingURL=user-login.js.map