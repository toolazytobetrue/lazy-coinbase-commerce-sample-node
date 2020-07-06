import { OrderDocument } from "../../models/order/order.model";
import { maptoCouponDocument } from "./coupon-mapper";
import { getOrderUser } from "./services.mappings";

// export const mapToAccountOrderDocument = (order: OrderDocument) => {
//     const {
//         amount,
//         amountWithDiscount,
//         coupon,
//         delivered,
//         status,
//         lastUpdated,
//         dateCreated,
//         ipAddress,
//     } = order;
//     return {
//         orderId: `${order._id}`,
//         delivered,
//         lastUpdated,
//         dateCreated,
//         amount,
//         amountWithDiscount,
//         ipAddress: ipAddress ? ipAddress : 'N/A',
//         coupon: coupon ? maptoCouponDocument(coupon) : null,
//         status,
//         account: order.account ? mapToAccountDocument(order.account) : null,
//         payment: getPaymentMap(order, true),
//         user: getOrderUser(order.user),
//     }
// } 

import { AccountDocument } from "../../models/sales/account.model";

export const mapToAccountDocument = (account: AccountDocument) => {
    return {
        accountId: account._id,
        title: account.title,
        description: account.description,
        images: account.images,
        price: account.price,
        stock: account.stock,
        dateCreated: account.dateCreated,
        lastUpdated: account.lastUpdated
    }
}