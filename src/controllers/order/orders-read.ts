import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, getAuthorizedUser, logDetails } from '../../util/utils';
import { USER_PERMISSIONS } from '../../models/enums/UserPermissions.enum';
import { Order, OrderDocument } from '../../models/order/order.model';
import { mapToOrderDocument } from '../mappings/gold-mappings';
// import { mapToAccountOrderDocument } from '../mappings/account-mappings';
// import { mapToServicesOrderDocument, mapToServicesOrderCalendarDocumentGeneric } from '../mappings/services.mappings';

export const readOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }

        if (isEmptyOrNull(req.query.type)) {
            return res.status(400).send("Order type is missing")
        }

        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }

        let orders: any[] = [];
        let _orders: any[] = [];
        let filter: any = {};
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        switch (req.query.type) {
            case 'services':
                filter = authorizedUser.groupId === USER_PERMISSIONS.WORKER ? { worker: authorizedUser.id } : {};
                filter = {
                    ...filter,
                    account: undefined,
                    gold: undefined,
                }
                _orders = await Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                    .populate('worker')
                    .populate('requests.worker')
                // orders = _orders.map(order => mapToServicesOrderDocument(order, authorizedUser.groupId !== 3));
                break;
            case 'gold':
                filter = { gold: { $ne: undefined } };
                _orders = await Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                // .populate('worker');

                // orders = _orders.map(order => mapToOrderDocument(order));
                break;
            case 'account':
                filter = { account: { $ne: undefined } };
                _orders = await Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                    .populate('worker');

                // orders = _orders.map(order => mapToAccountOrderDocument(order));
                break;
        }
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: await Order.find(filter).countDocuments(),
            orders: _orders
        });
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}

export const readOrdersByCalendar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.month) || isNaN(+req.query.month) || !Number.isInteger(+req.query.month)) {
            return res.status(400).send("Month is missing")
        }
        if (isEmptyOrNull(req.query.year) || isNaN(+req.query.year) || !Number.isInteger(+req.query.year)) {
            return res.status(400).send("Year is missing")
        }
        let _orders = await Order.find({
            $and: [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$dateCreated" }, +req.query.month]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$dateCreated" }, +req.query.year]
                    }
                },
                {
                    gold: undefined
                },
                {
                    account: undefined
                },
                {
                    startDate: {
                        $ne: undefined
                    }
                },
                {
                    endDate: {
                        $ne: undefined
                    }
                }
            ]

        })
        // let orders = _orders.map(order => mapToServicesOrderCalendarDocumentGeneric(order, false));
        // return res.status(200).json(orders);
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}

