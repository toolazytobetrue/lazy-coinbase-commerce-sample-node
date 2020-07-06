import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails, getAuthorizedUser } from '../../util/utils';
import { Order } from '../../models/order/order.model';
import { mapToOrderDocument } from '../mappings/gold-mappings';

export const readOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing")
        }

        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        return res.status(200).json(mapToOrderDocument(order));

    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}