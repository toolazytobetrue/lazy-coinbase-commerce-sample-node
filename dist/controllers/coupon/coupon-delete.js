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
exports.deleteCoupon = void 0;
const utils_1 = require("../../util/utils");
const coupon_model_1 = require("../../models/sales/coupon.model");
exports.deleteCoupon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.couponId)) {
            return res.status(400).send("Coupon id is missing");
        }
        const coupon = yield coupon_model_1.Coupon.findById(req.params.couponId);
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        yield coupon_model_1.Coupon.deleteOne({ _id: req.params.couponId });
        return res.status(200).json({ result: 'Successfully deleted coupon from the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error deleting coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=coupon-delete.js.map