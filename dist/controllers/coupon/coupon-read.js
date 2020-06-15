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
exports.readCoupons = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const coupons = yield coupon_model_1.Coupon.find()
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });
        const _coupons = coupons.map(coupon => coupon_mapper_1.maptoCouponDocument(coupon));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: yield coupon_model_1.Coupon.find().countDocuments(),
            coupons: _coupons
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching coupons: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=coupon-read.js.map