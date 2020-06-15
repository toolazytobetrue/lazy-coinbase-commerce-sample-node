import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Coupon } from "../../models/sales/coupon.model";
import { maptoCouponDocument } from "../mappings/coupon-mapper";

export const applyCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.code)) {
            return res.status(400).send("Coupon code is missing")
        }
        const coupon = await Coupon.findOne({ code: req.body.code }).sort({ dateCreated: -1 });
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        if (!coupon.enabled) {
            return res.status(400).send(`Coupon is disabled`);
        }
        return res.status(200).json(maptoCouponDocument(coupon))
    } catch (err) {
        logDetails('error', `Error while fetching coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};

