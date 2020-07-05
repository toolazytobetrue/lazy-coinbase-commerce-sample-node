"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceMinigame = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const service_model_1 = require("./service.model");
const ServiceMinigameSchema = new mongoose_1.default.Schema({
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    service: { type: service_model_1.Service.schema, required: true }
});
ServiceMinigameSchema.pre('save', function save(next) {
    const service = this;
    service.lastUpdated = new Date();
    next();
});
exports.ServiceMinigame = mongoose_1.default.model('ServiceMinigame', ServiceMinigameSchema);
//# sourceMappingURL=serviceminigame.model.js.map