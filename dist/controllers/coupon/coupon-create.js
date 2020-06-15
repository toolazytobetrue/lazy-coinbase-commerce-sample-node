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
const mathjs_1 = require("mathjs");
const coupon_model_1 = require("../../models/sales/coupon.model");
exports.createCoupon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.code)) {
            return res.status(400).send("Coupon code is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.amount)) {
            return res.status(400).send("Coupon amount is missing");
        }
        if (isNaN(req.body.amount)) {
            return res.status(400).send("Coupon amount is not a number");
        }
        if (+req.body.amount <= 0) {
            return res.status(400).send("Coupon amount cannot be zero or negative");
        }
        if (utils_1.isEmptyOrNull(req.body.gold) || typeof req.body.gold !== 'boolean') {
            return res.status(400).send("Coupon gold flag is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.services) || typeof req.body.services !== 'boolean') {
            return res.status(400).send("Coupon services flag is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.accounts) || typeof req.body.accounts !== 'boolean') {
            return res.status(400).send("Coupon accounts flag is missing");
        }
        const coupon = yield (new coupon_model_1.Coupon({
            code: req.body.code,
            amount: +mathjs_1.round(+req.body.amount, 2),
            gold: req.body.gold,
            services: req.body.services,
            accounts: req.body.accounts,
            dateCreated: new Date(),
            enabled: true
        })).save();
        return res.status(200).json({ result: 'Successfully added a new coupon to the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error adding coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=coupon-create.js.map