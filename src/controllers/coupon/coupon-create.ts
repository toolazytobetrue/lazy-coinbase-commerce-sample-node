import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { round } from "mathjs";
import { Coupon } from "../../models/sales/coupon.model";

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.code)) {
            return res.status(400).send("Coupon code is missing")
        }
        if (isEmptyOrNull(req.body.amount)) {
            return res.status(400).send("Coupon amount is missing")
        }
        if (isNaN(req.body.amount)) {
            return res.status(400).send("Coupon amount is not a number")
        }
        if (+req.body.amount <= 0) {
            return res.status(400).send("Coupon amount cannot be zero or negative")
        }
        if (isEmptyOrNull(req.body.gold) || typeof req.body.gold !== 'boolean') {
            return res.status(400).send("Coupon gold flag is missing")
        }
        if (isEmptyOrNull(req.body.services) || typeof req.body.services !== 'boolean') {
            return res.status(400).send("Coupon services flag is missing")
        }
        if (isEmptyOrNull(req.body.accounts) || typeof req.body.accounts !== 'boolean') {
            return res.status(400).send("Coupon accounts flag is missing")
        }
        const coupon = await (new Coupon({
            code: req.body.code,
            amount: +round(+req.body.amount, 2),
            gold: req.body.gold,
            services: req.body.services,
            accounts: req.body.accounts,
            dateCreated: new Date(),
            enabled: true
        })).save()
        return res.status(200).json({ result: 'Successfully added a new coupon to the DB' })
    } catch (err) {
        logDetails('error', `Error adding coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};