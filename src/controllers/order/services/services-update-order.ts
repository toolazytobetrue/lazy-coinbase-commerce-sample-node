import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull, isDbObjectId } from '../../../util/utils';
import { Order } from '../../../models/order/order.model';
export const updateServicesOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.orderId) || !isDbObjectId(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }

        order.delivered = !order.delivered;
        await order.save();
        return res.status(200).json({ result: `Successfully updated order ${order._id}` });
    } catch (err) {
        logDetails('error', `Error updating an order ${err}`);
        return res.status(500).send('Failed to update an order');
    }
} 