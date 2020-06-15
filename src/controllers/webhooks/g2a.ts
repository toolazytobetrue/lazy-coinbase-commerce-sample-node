import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails } from '../../util/utils';
import { round } from 'mathjs';
import { getG2AIPNHash } from '../../api/paymentgateways/g2a-api';
export const webhookG2A = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.transactionId) || isEmptyOrNull(req.body.userOrderId) || isEmptyOrNull(req.body.amount) || isEmptyOrNull(req.body.hash)) {
            logDetails('error', 'Fields required to verify hash ' + JSON.stringify(req.body));
            return res.status(500).send("Fields required to verify hash");
        }
        const calculatedHash = getG2AIPNHash(req.body.transactionId, req.body.userOrderId, req.body.amount);
        if (calculatedHash !== req.body.hash) {
            logDetails('error', 'Error verifying hash ' + JSON.stringify(req.body));
            return res.status(400).send("Error verifying hash");
        }
        return res.status(200).json({ result: 'Successfully added G2A Webhook' });
    } catch (err) {
        logDetails('error', 'Error adding a g2a transaction ' + JSON.stringify(req.body));
        return res.status(500).send("Something wrong happened while adding a g2a transaction")
    }
};
