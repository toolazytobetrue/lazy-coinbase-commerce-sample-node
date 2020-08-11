import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails, getAuthorizedUser } from '../../../util/utils';
import { PaymentGateway } from '../../../models/entities/payment-gateway.model';
import { Account } from '../../../models/sales/account.model';
import { CouponDocument, Coupon } from '../../../models/sales/coupon.model';
import { transactionCreateAccountOrder } from '../../../api/order/create_account_order';

export const createAccountOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;

        let userId = null;
        if (isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }

        if (isEmptyOrNull(req.body.currency)) {
            return res.status(400).send("Currency is missing");
        }

        if (req.body.currency !== 'USD' && req.body.currency !== 'EUR' && req.body.currency !== 'CAD' && req.body.currency !== 'CNY' && req.body.currency !== 'NZD') {
            return res.status(400).send("Currency not found")
        }

        const paymentGateway = await PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }

        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser !== null) {
            userId = authorizedUser.id;
        }
        if (paymentGateway.requiresLogin) {
            if (authorizedUser === null) {
                return res.status(401).send("Unauthorized access");
            }
        }

        if (isEmptyOrNull(req.body.accountId)) {
            return res.status(400).send("Account id is missing");
        }
        const account = await Account.findById(req.body.accountId);
        if (!account) {
            return res.status(404).send("Account not found");
        }
        if (account.stock === 0) {
            return res.status(400).send("Account not available in stock");
        }

        let coupon: null | undefined | CouponDocument;
        if (!isEmptyOrNull(req.body.couponId)) {
            coupon = await Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            if (!coupon.accounts) {
                return res.status(400).send(`Coupon is not valid for accounts orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        const genericTransaction = await transactionCreateAccountOrder(req.body.currency, paymentGateway, account, userId, coupon, userIpAddress);
        return res.status(200).json({ redirect_url: genericTransaction.redirect_url });

    } catch (err) {
        logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
} 