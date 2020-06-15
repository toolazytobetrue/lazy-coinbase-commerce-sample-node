import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { round } from "mathjs";
import { Coupon } from "../../models/sales/coupon.model";

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.couponId)) {
            return res.status(400).send("Coupon id is missing")
        }
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
        if (isEmptyOrNull(req.body.enabled) || typeof req.body.enabled !== 'boolean') {
            return res.status(400).send("Coupon enabled flag is missing")
        }
        const coupon = await Coupon.findById(req.params.couponId);
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        coupon.code = req.body.code;
        coupon.amount = +round(req.body.amount, 2);
        coupon.gold = req.body.gold;
        coupon.services = req.body.services;
        coupon.accounts = req.body.accounts;
        coupon.enabled = req.body.enabled;
        await coupon.save();
        return res.status(200).json({ result: `Successfully updated coupon ${coupon._id} in the DB` })
    } catch (err) {
        logDetails('error', `Error updating coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};