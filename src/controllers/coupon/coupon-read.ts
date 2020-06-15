import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { CouponDocument, Coupon } from "../../models/sales/coupon.model";
import { maptoCouponDocument } from "../mappings/coupon-mapper";

export const readCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const coupons = await Coupon.find()
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });

        const _coupons = coupons.map(coupon => maptoCouponDocument(coupon));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Coupon.find().countDocuments(),
            coupons: _coupons
        });
    } catch (err) {
        logDetails('error', `Error while fetching coupons: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
}; 