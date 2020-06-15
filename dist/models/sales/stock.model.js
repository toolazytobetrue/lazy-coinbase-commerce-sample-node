"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const StockSchema = new mongoose_1.default.Schema({
    rs3: {
        buying: { type: Number, required: true },
        selling: { type: Number, required: true },
        units: { type: Number, required: true }
    },
    osrs: {
        buying: { type: Number, required: true },
        selling: { type: Number, required: true },
        units: { type: Number, required: true }
    },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
StockSchema.pre('save', function save(next) {
    const stock = this;
    stock.lastUpdated = new Date();
    next();
});
exports.Stock = mongoose_1.default.model('Stock', StockSchema);
//# sourceMappingURL=stock.model.js.map