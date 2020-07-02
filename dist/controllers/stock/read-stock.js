"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const stock_model_1 = require("../../models/sales/stock.model");
exports.readAllStock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
        //     return res.status(400).send("Page number is missing")
        // }
        // const numberPerPage = 10;
        // const pageNumber = +req.query.pageNumber;
        const stocks = yield stock_model_1.Stock.find()
            .populate('paymentgateway')
            .sort({ dateCreated: -1 });
        // .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
        // .limit(numberPerPage);
        return res.status(200).json(stocks.map(stock => exports.mapToStock(stock)));
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
exports.readLatestStock = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const latestStock = yield stock_model_1.Stock.findOne().sort({ dateCreated: -1 });
        if (!latestStock) {
            return res.status(400).send("Last stock prices not found");
        }
        return res.status(200).send(exports.mapToStock(latestStock));
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
exports.mapToStock = (stock) => {
    return {
        stockId: stock._id,
        rs3: {
            buying: stock.rs3.buying,
            selling: stock.rs3.selling,
            units: stock.rs3.units
        },
        osrs: {
            buying: stock.osrs.buying,
            selling: stock.osrs.selling,
            units: stock.osrs.units
        },
        dateCreated: stock.dateCreated,
        lastUpdated: stock.lastUpdated,
        paymentgateway: exports.mapToPaymentGateway(stock.paymentgateway)
    };
};
exports.mapToPaymentGateway = (payment) => {
    return {
        name: payment.name,
        img: payment.img,
        lastUpdated: payment.lastUpdated,
        dateCreated: payment.dateCreated,
        enabled: payment.enabled,
        requiresLogin: payment.requiresLogin,
        requiresVerification: payment.requiresVerification,
        fees: payment.fees
    };
};
//# sourceMappingURL=read-stock.js.map