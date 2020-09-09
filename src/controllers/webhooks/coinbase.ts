import { NextFunction, Request, Response } from 'express';
import { logDetails } from '../../util/utils';
import { Webhook } from '../../app';
import { COINBASE_WEBHOOK_SECRET } from '../../util/secrets';
import { Order } from '../../models/order/order.model';
import { PaymentGateway } from '../../models/entities/payment-gateway.model';
export const webhookCoinbase = async (req: Request, res: any, next: NextFunction) => {
    try {
        const headers: any = req.headers['x-cc-webhook-signature'];
        Webhook.verifySigHeader(JSON.stringify(req.body), headers, COINBASE_WEBHOOK_SECRET);
        try {

            const transaction = req.body;
            const total = transaction.event.data.timeline.length;
            const lastTimeline = transaction.event.data.timeline[total - 1];
            const identifier = transaction.event.data.id;

            const order = await Order.findOne({ "payment.coinbase.identifier": identifier });
            if (order && order.payment && order.payment.coinbase) {
                if (transaction.event.data.payments && Array.isArray(transaction.event.data.payments) && transaction.event.data.payments.length > 0) {
                    order.payment.coinbase.payments = transaction.event.data.payments.map((p: any) => {
                        return {
                            status: p.status.toUpperCase(),
                            local: { amount: p.value.local.amount, currency: p.value.local.currency },
                            crypto: { amount: p.value.crypto.amount, currency: p.value.crypto.currency }
                        }
                    });
                }
                if (transaction.event.data.timeline && Array.isArray(transaction.event.data.timeline) && transaction.event.data.timeline.length > 0) {
                    order.payment.coinbase.timeline = transaction.event.data.timeline.map((p: any) => {
                        return {
                            time: p.time,
                            status: p.status,
                            context: p.context
                        }
                    });
                }
                if (lastTimeline.status === 'CONFIRMED') {
                    // if (order.gold) {
                    //     const crypto = await PaymentGateway.findOne({ name: 'crypto' });
                    //     if (crypto) {
                    //         const lastStock = await Stock.findOne({ paymentgateway: crypto._id });
                    //         if (lastStock) {
                    //             if (order.gold.server === 1) {
                    //                 lastStock.osrs.units = lastStock.osrs.units - order.gold.units > 0 ? lastStock.osrs.units - order.gold.units : 0;
                    //             } else {
                    //                 lastStock.rs3.units = lastStock.rs3.units - order.gold.units > 0 ? lastStock.rs3.units - order.gold.units : 0;
                    //             }
                    //         }
                    //     }
                    // } 
                }
                await order.save();
                logDetails('debug', `[COINBASE][UPDATE] Deposit: ${transaction.event.data.id} - ${lastTimeline.status}`);
            }
        } catch (err) {
            logDetails('error', `Erorr saving coinbase model ${JSON.stringify(err)}`);
            return
        }
        return res.status(200).json({ result: 'Successfully verified coinbase webhook' });
    } catch (error) {
        logDetails('error', 'Error verifying coinbase webhook ' + error);
        return res.status(500).send('Error verifying coinbase webhook ' + error)
    }
}; 