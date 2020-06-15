import { OrderDocument } from "../../models/order/order.model";
import { GoldDocument } from "../../models/sales/gold.model";
import { mapToStock } from "../stock/read-stock";
import { getPaymentMap } from "./payment-mappings";
import { maptoCouponDocument } from "./coupon-mapper";
import { getOrderUser } from "./services.mappings";

export const mapToGoldOrderDocument = (order: OrderDocument) => {
    const {
        amount,
        amountWithDiscount,
        delivered,
        rsn,
        status,
        lastUpdated,
        dateCreated,
        coupon,
        ipAddress
    } = order;
    return {
        orderId: `${order._id}`,
        delivered,
        rsn,
        lastUpdated,
        dateCreated,
        amount,
        amountWithDiscount,
        ipAddress: ipAddress ? ipAddress : 'N/A',
        status,
        gold: order.gold ? mapToOrderGoldDocument(order.gold) : null,
        payment: getPaymentMap(order, true),
        coupon: coupon ? maptoCouponDocument(coupon) : null,
        user: getOrderUser(order.user),
    }
}

export const mapToOrderGoldDocument = (goldDoc: GoldDocument) => {
    return {
        goldOrderId: `${goldDoc._id}`,
        units: goldDoc.units,
        type: goldDoc.type,
        stockAtTheTime: mapToStock(goldDoc.stock)
    }
}