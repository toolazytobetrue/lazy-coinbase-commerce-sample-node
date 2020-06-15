import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Coupon } from "../../models/sales/coupon.model";

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.couponId)) {
            return res.status(400).send("Coupon id is missing")
        }
        const coupon = await Coupon.findById(req.params.couponId);
        if (!coupon) {
            return res.status(404).send("Coupon not found");
        }
        await Coupon.deleteOne({ _id: req.params.couponId })
        return res.status(200).json({ result: 'Successfully deleted coupon from the DB' })
    } catch (err) {
        logDetails('error', `Error deleting coupon: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};