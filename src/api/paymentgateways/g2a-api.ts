import * as crypto from 'crypto';
import rp from 'request-promise';
import { G2A_API_HASH, MERCHANT_EMAIL, G2A_API_SECRET, G2A_REST_URL, G2A_CHECKOUT_URL } from '../../util/secrets';


export async function createG2APayment(payload: any) {
    var options = {
        method: 'POST',
        uri: `${G2A_CHECKOUT_URL}/index/createQuote`,
        form: payload
    };
    return await rp(options);
}

export async function getG2APayment(transactionId: string) {
    var options = {
        method: 'GET',
        uri: `${G2A_REST_URL}/transactions/${transactionId}`,
        headers: {
            Authorization: {
                apiHash: G2A_API_HASH,
                hash: getG2AAuthHash(G2A_API_HASH, MERCHANT_EMAIL, G2A_API_SECRET),
            },
        }
    };
    return await rp(options);
}

export async function refundG2APayment(transactionId: string, userOrderId: string, amount: number, refundedAmount: number) {
    const calculatedHash = getG2ARefundHash(transactionId, userOrderId, amount, refundedAmount, G2A_API_SECRET);
    const options = {
        method: 'PUT',
        uri: `${G2A_REST_URL}/transactions/${transactionId}?action=refund&amount=${amount}&hash=${calculatedHash}`,
        headers: {
            Authorization: {
                apiHash: G2A_API_HASH,
                authHash: getG2AAuthHash(G2A_API_HASH, MERCHANT_EMAIL, G2A_API_SECRET),
            },
        },
    };
    return await rp(options);
}

export function getG2AOrderHash(userOrderId: string, amount: string, currency: string, apiSecret: string) {
    return crypto.createHmac('sha256', `${userOrderId}${amount}${currency}${apiSecret}`).digest('hex');
}

export function getG2AAuthHash(apiHash: string, merchantEmail: string, apiSecret: string) {
    return crypto.createHmac('sha256', `${apiHash}${merchantEmail}${apiSecret}`).digest('hex');
}

export function getG2ARefundHash(transactionId: string, userOrderId: string, amount: number, refundedAmount: number, apiSecret: string) {
    return crypto.createHmac('sha256', `${transactionId}${userOrderId}${amount}${refundedAmount}${apiSecret}`).digest('hex');
}

export function getG2AIPNHash(transactionId: string, userOrderId: string, amount: number, apiSecret: string = G2A_API_SECRET) {
    return crypto.createHash('sha256').update(`${transactionId}${userOrderId}${amount}${apiSecret}`).digest('hex');
} 