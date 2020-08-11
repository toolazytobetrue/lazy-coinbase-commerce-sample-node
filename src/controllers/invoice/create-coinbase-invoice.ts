import { CreateCharge } from "coinbase-commerce-node";
import { getOrderUrl } from "../../util/utils";
import { Charge } from "../../app";

export const createCoinbaseInvoice = async (currency: string, orderId: string, totalAmount: number, name: string, description: string): Promise<{ id: string, code: string, hosted_url: string }> => {
    try {
        let chargeData: CreateCharge = {
            'name': name,
            'description': description,
            'local_price': {
                'amount': `${+totalAmount}`,
                'currency': currency
            },
            'pricing_type': 'fixed_price',
            'redirect_url': getOrderUrl(orderId)
        }
        const invoice: any = await Charge.create(chargeData);
        return Promise.resolve(invoice);
    } catch (err) {
        return Promise.reject(err);
    }
}