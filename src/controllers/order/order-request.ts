import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull, getAuthorizedUser } from '../../util/utils';
import { Order } from '../../models/order/order.model';
import { round } from 'mathjs';

export const requestOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const userId = authorizedUser ? authorizedUser.id : null
        if (isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }

        await order.save();
        return res.status(200).json({ result: `Successfully requested assignment to task ${order._id}` });
    } catch (err) {
        logDetails('error', `Error request task order ${err}`);
        return res.status(500).send(`Error request task order ${err.message}`);
    }
} 