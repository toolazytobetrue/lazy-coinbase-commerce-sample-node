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
        const unitPrice = +round(order.gold.server === 1 ? order.gold.stock.osrs.selling : order.gold.stock.rs3.selling, 2);
        amount = +round(order.gold ? order.gold.units * unitPrice : 0);
        amountWithDiscount = +round(amount * ratio, 2);
    } else if (order.account) {
        amount = +round(order.account ? +round(order.account.price, 2) : 0);
        amountWithDiscount = +round(amount * ratio, 2);
    } else {
        if (order.services !== undefined && order.services !== null) {
            if (order.services.length > 0) {
                order.services.forEach(s => {
                    amount += +round(s.service.price, 2);
                });
            }
        }
        if (order.powerleveling !== undefined && order.powerleveling !== null) {
            if (order.powerleveling.length > 0) {
                order.powerleveling.forEach(s => {
                    amount += +round(s.price, 2);
                });
            }
        }
        amountWithDiscount = +round(amount * ratio, 2);
    }

    let status = order.status;
    if (order.payment !== null && order.payment.coinbase !== null && order.payment.coinbase !== undefined && order.payment.coinbase.timeline !== null && order.payment.coinbase.timeline !== undefined) {
        if (order.payment.coinbase.timeline.length > 0) {
            status = order.payment.coinbase.timeline[order.payment.coinbase.timeline.length - 1].status;
        }
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
        status: status,
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