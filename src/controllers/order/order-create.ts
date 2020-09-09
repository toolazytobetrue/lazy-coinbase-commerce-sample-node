import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails, getAuthorizedUser, checkRSN, currencies, deepClone } from '../../util/utils';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ObjectId = require("mongodb").ObjectID;
        const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        userId = authorizedUser.id;
        // const genericTransaction = await transactionCreateOrder(req.body.currency, paymentGateway, services, powerleveling, accountsOrdered, userId, coupon, userIpAddress);
        // return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
    } catch (err) {
        logDetails('error', `Error create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
}