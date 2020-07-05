"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Powerleveling = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const skill_model_1 = require("./skill.model");
const PowerLevelingSchema = new mongoose_1.default.Schema({
    fromLevel: { type: Number, required: true },
    toLevel: { type: Number, required: true },
    skill: { type: skill_model_1.Skill.schema, required: true },
    price: { type: Number, required: true },
    totalXp: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
PowerLevelingSchema.pre('save', function save(next) {
    const powerleveling = this;
    powerleveling.lastUpdated = new Date();
    next();
});
exports.Powerleveling = mongoose_1.default.model('Powerleveling', PowerLevelingSchema);
//# sourceMappingURL=powerleveling.model.js.map