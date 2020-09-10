import { createCoinbaseInvoice } from '../payment-gateways/create-coinbase-invoice';
import { generateUuid } from '../../util/utils';

export async function transactionCreateOrder(price: number) {
    try {
        const uuid = generateUuid();
        const coinbaseCharge = await createCoinbaseInvoice(uuid, price, `Order Sample`, `UUID: ${uuid}`);
        return Promise.resolve({
            redirect_url: coinbaseCharge.hosted_url
        });
    } catch (err) {
        throw new Error(err)
    }
} 