import { NextFunction, Request, Response } from 'express';
import { logDetails } from '../../util/utils';
import { Webhook } from '../../app';
import { COINBASE_WEBHOOK_SECRET } from '../../util/secrets';
import { User } from '../../models/user/user.model';
import { Order } from '../../models/order/order.model';
import { Stock } from '../../models/sales/stock.model';
import { Account } from '../../models/sales/account.model';
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
                    if (order.gold) {
                        const lastStock = await Stock.findOne().sort({ dateCreated: -1 });
                        if (lastStock) {
                            if (order.gold.type === 'RS3') {
                                lastStock.rs3.units = lastStock.rs3.units - order.gold.units > 0 ? lastStock.rs3.units - order.gold.units : 0;
                            }
                            if (order.gold.type === 'OSRS') {
                                lastStock.osrs.units = lastStock.osrs.units - order.gold.units > 0 ? lastStock.osrs.units - order.gold.units : 0;
                            }
                        }
                    }

                    if (order.account) {
                        const account = order.account;
                        const accounts = await Account.find({ sold: false });
                        const found = accounts.find(_ => `${_._id}` === `${account._id}`);
                        if (found) {
                            found.sold = true;
                            order.account.sold = true;
                            await found.save();
                            await order.account.save();
                        }
                    }
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