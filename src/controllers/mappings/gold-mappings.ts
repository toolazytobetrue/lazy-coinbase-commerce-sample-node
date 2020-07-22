import { OrderDocument, GoldDocument } from "../../models/order/order.model";
import { maptoCouponDocument } from "./coupon-mapper";
import { getOrderUser } from "./services.mappings";
import { round } from "mathjs";
import { mapToStock, mapToPaymentGateway } from "./all";
import { getPayment } from "./payment-mappings";
import { mapToAccountDocument } from "./account-mappings";

export const mapToOrderDocument = (order: OrderDocument) => {
    let amount = 0;
    const percentage = 100 - (order.coupon ? order.coupon.amount : 0);
    const ratio = percentage / 100;
    let amountWithDiscount = 0;

    if (order.gold) {
        amount = +round(order.gold ? order.gold.units * (order.gold.server === 1 ? order.gold.stock.osrs.selling : order.gold.stock.rs3.selling, 2) : 0);
        amountWithDiscount = +round(amount * ratio, 2);
    } else if (order.account) {
        amount = +round(order.account ? +round(order.account.price, 2) : 0);
        amountWithDiscount = +round(amount * ratio, 2);
    }
    return {
        orderId: `${order._id}`,
        amount,
        amountWithDiscount,
        uuid: order.uuid,
        delivered: order.delivered,
        lastUpdated: order.lastUpdated,
        dateCreated: order.dateCreated,
        paymentGateway: mapToPaymentGateway(order.paymentGateway),
        status: order.status,
        payment: getPayment(order),
        user: order.user ? getOrderUser(order.user) : null,
        coupon: order.coupon ? maptoCouponDocument(order.coupon) : null,
        ipAddress: order.ipAddress ? order.ipAddress : 'N/A',
        gold: order.gold ? mapToOrderGoldDocument(order.gold) : null,
        account: order.account ? mapToAccountDocument(order.account) : null,
        services: order.services,
        powerleveling: order.powerleveling
    }
}

export const mapToOrderGoldDocument = (goldDoc: GoldDocument) => {
    return {
        goldOrderId: `${goldDoc._id}`,
        units: goldDoc.units,
        server: goldDoc.server,
        stock: mapToStock(goldDoc.stock),
        rsn: goldDoc.rsn
    }
}