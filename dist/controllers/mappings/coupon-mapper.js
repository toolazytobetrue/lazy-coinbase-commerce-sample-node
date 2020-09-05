"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maptoCouponDocument = void 0;
exports.maptoCouponDocument = (coupon) => {
    return {
        couponId: coupon._id,
        code: coupon.code,
        amount: coupon.amount,
        enabled: coupon.enabled,
        dateCreated: coupon.dateCreated,
        lastUpdated: coupon.lastUpdated
    };
};
//# sourceMappingURL=coupon-mapper.js.map