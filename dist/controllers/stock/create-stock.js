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
exports.updateStock = void 0;
const utils_1 = require("../../util/utils");
const stock_model_1 = require("../../models/sales/stock.model");
const mathjs_1 = require("mathjs");
exports.updateStock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.stockId)) {
            return res.status(400).send("Stock id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.osrs.units) || isNaN(+req.body.osrs.units)) {
            return res.status(400).send("OSRS units is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.osrs.selling) || isNaN(+req.body.osrs.selling)) {
            return res.status(400).send("OSRS selling price is missing");
        }
        if (+req.body.osrs.selling <= 0) {
            return res.status(400).send("OSRS selling price cannot be zero or negative");
        }
        if (utils_1.isEmptyOrNull(req.body.rs3.units) || isNaN(+req.body.rs3.units)) {
            return res.status(400).send("RS3 units is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.rs3.selling) || isNaN(+req.body.rs3.selling)) {
            return res.status(400).send("RS3 selling price is missing");
        }
        if (+req.body.rs3.selling <= 0) {
            return res.status(400).send("OSRS Selling price cannot be zero or negative");
        }
        const latestStock = yield stock_model_1.Stock.findOne({ _id: req.body.stockId }).populate('paymentgateway');
        if (!latestStock) {
            return res.status(400).send("Stock price for this payment gateway was not found");
        }
        latestStock.rs3.selling = +mathjs_1.round(req.body.rs3.selling, 2);
        latestStock.rs3.units = +mathjs_1.round(req.body.rs3.units, 2);
        latestStock.osrs.selling = +mathjs_1.round(req.body.osrs.selling, 2);
        latestStock.osrs.units = +mathjs_1.round(req.body.osrs.units, 2);
        yield latestStock.save();
        return res.status(200).json({ result: 'Successfully created new stock prices' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error create stock: ${err}`);
        return res.status(500).send('Failed to create stock');
    }
});
//# sourceMappingURL=create-stock.js.map