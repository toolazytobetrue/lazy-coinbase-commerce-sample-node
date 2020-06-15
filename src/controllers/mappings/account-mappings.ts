import { OrderDocument } from "../../models/order/order.model";
import { getPaymentMap } from "./payment-mappings";
import { mapToAccountDocument } from "../account/account-mappings";
import { maptoCouponDocument } from "./coupon-mapper";
import { getOrderUser } from "./services.mappings";

export const mapToAccountOrderDocument = (order: OrderDocument) => {
    const {
        amount,
        amountWithDiscount,
        coupon,
        delivered,
        status,
        lastUpdated,
        dateCreated,
        ipAddress,
    } = order;
    return {
        orderId: `${order._id}`,
        delivered,
        lastUpdated,
        dateCreated,
        amount,
        amountWithDiscount,
        ipAddress: ipAddress ? ipAddress : 'N/A',
        coupon: coupon ? maptoCouponDocument(coupon) : null,
        status,
        account: order.account ? mapToAccountDocument(order.account) : null,
        payment: getPaymentMap(order, true),
        user: getOrderUser(order.user),
    }
} 