import { StockDocument } from "../../models/sales/stock.model"
import { PaymentGatewayDocument } from "../../models/entities/payment-gateway.model"

export const mapToStock = (stock: StockDocument) => {
    return {
        stockId: stock._id,
        rs3: {
            buying: stock.rs3.buying,
            selling: stock.rs3.selling,
            units: stock.rs3.units
        },
        osrs: {
            buying: stock.osrs.buying,
            selling: stock.osrs.selling,
            units: stock.osrs.units
        },
        dateCreated: stock.dateCreated,
        lastUpdated: stock.lastUpdated,
        paymentgateway: mapToPaymentGateway(<any>stock.paymentgateway)
    }
}


export const mapToPaymentGateway = (paymentGateway: PaymentGatewayDocument) => {
    return {
        paymentGatewayId: paymentGateway._id,
        name: paymentGateway.name,
        lastUpdated: paymentGateway.lastUpdated,
        dateCreated: paymentGateway.dateCreated,
        requiresLogin: paymentGateway.requiresLogin,
        img: paymentGateway.img,
        enabled: paymentGateway.enabled,
        fees: paymentGateway.fees

    }
}