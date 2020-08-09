"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const mongoose_1 = __importStar(require("mongoose"));
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
    paymentgateway: { required: true, type: mongoose_1.Schema.Types.ObjectId, ref: 'PaymentGateway' },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
});
StockSchema.pre('save', function save(next) {
    const stock = this;
    stock.lastUpdated = new Date();
    next();
});
exports.Stock = mongoose_1.default.model('Stock', StockSchema);
//# sourceMappingURL=stock.model copy.js.map