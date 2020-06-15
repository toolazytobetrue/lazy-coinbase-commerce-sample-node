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
const coupon_model_1 = require("../../models/sales/coupon.model");
const coupon_mapper_1 = require("../mappings/coupon-mapper");
exports.applyCoupon = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.body.code)) {
            return res.status(400).send("Coupon code is missing");
        }
        const coupon = yield coupon_model_1.Coupon.findOne({ code: req.body.code }).sort({ dateCreated: -1 });
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        if (!coupon.enabled) {
            return res.status(400).send(`Coupon is disabled`);
        }
        return res.status(200).json(coupon_mapper_1.maptoCouponDocument(coupon));
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=coupon-apply.js.map