import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { Order } from '../../models/order/order.model';
import { round } from 'mathjs';

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }

        if (isEmptyOrNull(req.query.type)) {
            return res.status(400).send("Order type is missing");
        }

        if (isEmptyOrNull(req.body.status)) {
            return res.status(400).send("Order status is missing");
        }

        if (isEmptyOrNull(req.body.delivered)) {
            return res.status(400).send("Order delivered flag is missing");
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }

        // if (!isNaN(req.body.payout) && +req.body.payout >= 0) {
        //     order.payout = +req.body.payout ? +round(req.body.payout, 2) : 0;
        // }

        // order.worker = req.body.worker ? req.body.worker : null;
        // order.startDate = req.body.startDate ? req.body.startDate : null;
        // order.endDate = req.body.endDate ? req.body.endDate : null;
        order.status = req.body.status;
        order.delivered = req.body.delivered;
        await order.save();
        return res.status(200).json({ result: `Successfully updated order ${order._id}` });
    } catch (err) {
        logDetails('error', `Error updating an order ${err}`);
        return res.status(500).send('Failed to update an order');
    }
} 