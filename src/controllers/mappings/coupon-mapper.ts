import { CouponDocument } from "../../models/sales/coupon.model"

export const maptoCouponDocument = (coupon: CouponDocument) => {
    return {
        couponId: coupon._id,
        code: coupon.code,
        amount: coupon.amount,
        enabled: coupon.enabled,
        dateCreated: coupon.dateCreated,
        lastUpdated: coupon.lastUpdated
    }
}