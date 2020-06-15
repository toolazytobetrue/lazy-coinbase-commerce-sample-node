"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SkillRangeSchema = new mongoose_1.default.Schema({
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    price: { type: Number, required: true },
});
const SkillSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    range: [SkillRangeSchema],
    dateCreated: { type: Date, required: true },
    lastUpdated: Date
});
SkillSchema.pre('save', function save(next) {
    const skill = this;
    skill.lastUpdated = new Date();
    next();
});
exports.Skill = mongoose_1.default.model('Skill', SkillSchema);
//# sourceMappingURL=skill.model.js.map