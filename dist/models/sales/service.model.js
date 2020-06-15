"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ServiceSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    type: { type: Number, required: true },
    points: [String],
    requirements: [String],
    price: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
ServiceSchema.pre('save', function save(next) {
    const service = this;
    service.lastUpdated = new Date();
    next();
});
exports.Service = mongoose_1.default.model('Service', ServiceSchema);
//# sourceMappingURL=service.model.js.map