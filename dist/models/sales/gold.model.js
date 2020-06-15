"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const stock_model_1 = require("./stock.model");
const GoldSchema = new mongoose_1.default.Schema({
    units: { type: Number, required: true },
    type: { type: String, required: true },
    stock: { type: stock_model_1.Stock.schema, required: true }
});
exports.Gold = mongoose_1.default.model('Gold', GoldSchema);
//# sourceMappingURL=gold.model.js.map