import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull, getAuthorizedUser } from '../../../util/utils';
import { PaymentGateway } from '../../../models/entities/payment-gateway.model';
import { Stock } from '../../../models/sales/stock.model';
import { round } from 'mathjs';
import { transactionCreateGoldOrder } from '../../../api/order/create_transaction_order_gold';
import { MIN_GOLD_ORDER } from '../../../util/secrets';
import { Coupon, CouponDocument } from '../../../models/sales/coupon.model';

export const createGoldOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const userId = authorizedUser ? authorizedUser.id : null
        if (isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }

        const paymentGateway = await PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }

        const latestStock = await Stock.findOne().sort({ dateCreated: -1 });
        if (isEmptyOrNull(req.body.units) || isNaN(+req.body.units) || +req.body.units <= 0) {
            return res.status(400).send("Amount to purchase is invalid");
        }
        if (isEmptyOrNull(req.body.type)) {
            return res.status(400).send("Stock type is missing");
        }
        if (req.body.type !== 'RS3' && req.body.type !== 'OSRS') {
            return res.status(400).send("Stock type is wrong");
        }
        if (isEmptyOrNull(req.body.rsn)) {
            return res.status(400).send("RSN is missing");
        }
        if (req.body.rsn.length > 12) {
            return res.status(400).send("RSN cannot exceed 12 characters");
        }
        if (!latestStock) {
            throw new Error("Last stock prices not found");
        }

        let units = +round(req.body.units, 2);
        let unitPrice = 0;
        if (req.body.type === 'RS3') {
            if (latestStock.rs3.units < +req.body.units || latestStock.rs3.units <= 0) {
                return res.status(400).send("Cannot order more than available in stock");
            }
            unitPrice = latestStock.rs3.selling;
        } else if (req.body.type === 'OSRS') {
            if (latestStock.osrs.units < +req.body.units || latestStock.osrs.units <= 0) {
                return res.status(400).send("Cannot order more than available in stock");
            }
            unitPrice = latestStock.osrs.selling;
        }

        const totalOrderPrice = +round(unitPrice * units, 2);
        if (MIN_GOLD_ORDER && totalOrderPrice < +MIN_GOLD_ORDER) {
            return res.status(400).send(`Minimum gold order is ${MIN_GOLD_ORDER} USD`);
        }

        let coupon: null | undefined | CouponDocument;
        if (!isEmptyOrNull(req.body.couponId)) {
            coupon = await Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            if (!coupon.gold) {
                return res.status(400).send(`Coupon is not valid for gold orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        const order = await transactionCreateGoldOrder(req.body.type, +round(req.body.units, 2), latestStock, paymentGateway, userId, req.body.rsn, coupon, userIpAddress);
        return res.status(200).json({ redirect_url: order.redirect_url });
    } catch (err) {
        logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
} 