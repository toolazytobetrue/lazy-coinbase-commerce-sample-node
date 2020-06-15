import { G2A_API_HASH, G2A_API_SECRET, URL_ON_FAIL, URL_ON_SUCCESS } from "../../util/secrets";
import { getG2AOrderHash, createG2APayment } from "../../api/paymentgateways/g2a-api";
import { logDetails } from "../../util/utils";

export const createG2AInvoice = async (depositId: string, totalAmount: number, name: string, description: string, ipAddress: string) => {
    try {
        const item: any = {
            sku: `1`,
            name: description,
            amount: +totalAmount,
            qty: 1,
            type: 'digital',
            id: `${depositId}`,
            price: +totalAmount,
            url: '',
        };

        const payload: any = {
            api_hash: G2A_API_HASH,
            hash: getG2AOrderHash(depositId, totalAmount.toString(), 'USD', G2A_API_SECRET),
            order_id: depositId,
            amount: `${totalAmount}`,
            currency: 'USD',
            description: description,
            url_failure: URL_ON_FAIL,
            url_ok: URL_ON_SUCCESS,
            cart_type: 'digital',
            items: [item],
            customer_ip_address: ipAddress
        }
        const result = await createG2APayment(payload);
        const payment: any = JSON.parse(result);
        if (payment.status === "ok") {
            return Promise.resolve(payment);
        } else {
            return Promise.reject(`Payment error: ${payment.status}`);
        }
    } catch (err) {
        logDetails('error', `Error creating G2A invoice ${err}`);
        return Promise.reject(err);
    }
}