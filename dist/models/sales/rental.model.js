"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakerRental = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StakerRentalSchema = new mongoose_1.default.Schema({
    gold: { type: Number, required: true },
    usd: { type: Number, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
StakerRentalSchema.pre('save', function save(next) {
    const StakerRental = this;
    StakerRental.lastUpdated = new Date();
    next();
});
exports.StakerRental = mongoose_1.default.model('StakerRental', StakerRentalSchema);
//# sourceMappingURL=rental.model.js.map