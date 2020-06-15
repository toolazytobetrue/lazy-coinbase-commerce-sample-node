import { OrderDocument } from "../../models/order/order.model"; import { PaymentOrderStatus } from "../../models/enums/OrderStatus.enum";

export const getPaymentMap = (order: OrderDocument, showDetails: boolean) => {
    return {
        gateway: showDetails ? `${order.paymentGateway.name}` : 'Hidden',
        status: getOrderStatus(order),
        coinbase: showDetails ? {
            identifier: order.payment && order.payment.coinbase && order.payment.coinbase.identifier ? order.payment.coinbase.identifier : 'N/A',
            code: order.payment && order.payment.coinbase && order.payment.coinbase.code ? order.payment.coinbase.code : 'N/A',
            history: getOrderHistory(order),
            payments: getOrderPayments(order)
        } : null
    }
}

export const getOrderStatus = (order: OrderDocument) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.timeline && order.payment.coinbase.timeline.length > 0) {
        return order.payment.coinbase.timeline[order.payment.coinbase.timeline.length - 1].status;
    }
    return PaymentOrderStatus.INITIATED;
}

export const getOrderHistory = (order: OrderDocument) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.timeline && order.payment.coinbase.timeline.length > 0) {
        return order.payment.coinbase.timeline;
    }
    return [];
}

export const getOrderPayments = (order: OrderDocument) => {
    if (order.paymentGateway.name === 'Coinbase' && order.payment && order.payment.coinbase && order.payment.coinbase.payments && order.payment.coinbase.payments.length > 0) {
        return order.payment.coinbase.payments;
    }
    return [];
}