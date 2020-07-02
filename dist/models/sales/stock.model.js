"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
    paymentgateway: { type: mongoose_1.Schema.Types.ObjectId, ref: 'PaymentGateway' },
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