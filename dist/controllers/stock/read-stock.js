"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readLatestStock = void 0;
const utils_1 = require("../../util/utils");
const stock_model_1 = require("../../models/sales/stock.model");
const all_1 = require("../mappings/all");
exports.readLatestStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const latestStock = yield stock_model_1.Stock.findOne()
            .sort({ dateCreated: -1 })
            .populate('paymentgateway');
        if (!latestStock) {
            return res.status(400).send("Last stock prices not found");
        }
        return res.status(200).send(all_1.mapToStock(latestStock));
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
//# sourceMappingURL=read-stock.js.map