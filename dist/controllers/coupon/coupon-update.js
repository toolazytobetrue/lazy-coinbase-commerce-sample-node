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
exports.updateCoupon = void 0;
const utils_1 = require("../../util/utils");
const mathjs_1 = require("mathjs");
const coupon_model_1 = require("../../models/sales/coupon.model");
exports.updateCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.couponId)) {
            return res.status(400).send("Coupon id is missing");
        }
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
        if (utils_1.isEmptyOrNull(req.body.enabled) || typeof req.body.enabled !== 'boolean') {
            return res.status(400).send("Coupon enabled flag is missing");
        }
        const coupon = yield coupon_model_1.Coupon.findById(req.params.couponId);
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        coupon.code = req.body.code;
        coupon.amount = +mathjs_1.round(req.body.amount, 2);
        coupon.gold = req.body.gold;
        coupon.services = req.body.services;
        coupon.accounts = req.body.accounts;
        coupon.enabled = req.body.enabled;
        yield coupon.save();
        return res.status(200).json({ result: `Successfully updated coupon ${coupon._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=coupon-update.js.map