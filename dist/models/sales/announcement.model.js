"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AnnouncementSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    enabled: { type: Boolean, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
AnnouncementSchema.pre('save', function save(next) {
    const Announcement = this;
    Announcement.lastUpdated = new Date();
    next();
});
exports.Announcement = mongoose_1.default.model('Announcement', AnnouncementSchema);
//# sourceMappingURL=announcement.model.js.map