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
exports.createOrder = void 0;
const utils_1 = require("../../util/utils");
const create_order_1 = require("../../api/order/create_order");
const mathjs_1 = require("mathjs");
exports.createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.amount)) {
            return res.status(400).send("Amount is missing");
        }
        if (isNaN(req.body.amount)) {
            return res.status(400).send("Amount is not a number");
        }
        if (req.body.amount <= 0) {
            return res.status(400).send("Amount cannot be zero or negative");
        }
        const finalAmount = +mathjs_1.round(req.body.amount, 2);
        const transaction = yield create_order_1.transactionCreateOrder(finalAmount);
        return res.status(200).json({ redirect_url: transaction.redirect_url });
    }
    catch (err) {
        utils_1.logDetails('error', `Failed to create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
});
//# sourceMappingURL=order-create.js.map