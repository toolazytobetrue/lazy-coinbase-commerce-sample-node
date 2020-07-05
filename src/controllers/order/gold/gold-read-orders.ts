import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails } from '../../../util/utils';
import { Order } from '../../../models/order/order.model';
import { mapToOrderDocument } from '../../mappings/gold-mappings';

export const readGoldOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }

        let _orders: any[] = [];
        let filter: any = {};
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;

        filter = { gold: { $ne: undefined } };
        _orders = await Order.find(filter)
            .sort({ dateCreated: -1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .populate('user')

        const orders = _orders.map(order => mapToOrderDocument(order));

        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: await Order.find(filter).countDocuments(),
            orders: orders
        });
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}
