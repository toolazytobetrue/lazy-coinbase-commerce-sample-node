import { OrderDocument } from "../../models/order/order.model"; import { PaymentOrderStatus } from "../../models/enums/OrderStatus.enum";

export const getPayment = (order: OrderDocument) => {
    return {
        coinbase: {
            identifier: order.payment.coinbase?.identifier,
            code: order.payment.coinbase?.code,
            timeline: order.payment.coinbase?.timeline,
            payments: order.payment.coinbase?.payments
        }
    }
}