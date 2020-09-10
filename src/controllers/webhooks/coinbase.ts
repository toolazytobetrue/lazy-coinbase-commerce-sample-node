import { NextFunction, Request, Response } from 'express';
import { logDetails } from '../../util/utils';
import { Webhook } from '../../app';
import { COINBASE_WEBHOOK_SECRET } from '../../util/secrets';
export const webhookCoinbase = async (req: Request, res: any, next: NextFunction) => {
    try {
        const headers: any = req.headers['x-cc-webhook-signature'];
        Webhook.verifySigHeader(JSON.stringify(req.body), headers, COINBASE_WEBHOOK_SECRET);
        try {

            const transaction = req.body;
            const total = transaction.event.data.timeline.length;
            const lastTimeline = transaction.event.data.timeline[total - 1];
            const identifier = transaction.event.data.id;
            /**
             * Use the identifier (generate id by coinbase to find your order for instance)
             */

            if (lastTimeline.status === 'CONFIRMED') {

            } else {

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