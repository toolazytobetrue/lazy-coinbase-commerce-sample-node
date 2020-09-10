import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { transactionCreateOrder } from '../../api/order/create_order';
import { round } from 'mathjs';
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.amount)) {
            return res.status(400).send("Amount is missing");
        }
        if (isNaN(req.body.amount)) {
            return res.status(400).send("Amount is not a number");
        }
        if (req.body.amount <= 0) {
            return res.status(400).send("Amount cannot be zero or negative");
        }
        const finalAmount = +round(req.body.amount, 2);
        const transaction = await transactionCreateOrder(finalAmount);
        return res.status(200).json({ redirect_url: transaction.redirect_url });
    } catch (err) {
        logDetails('error', `Failed to create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
}