import { User } from "../../models/user/user.model";
import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull, getAuthorizedUser } from "../../util/utils";
import { Order } from "../../models/order/order.model";

export const getUserOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(200).send(null);
        }

        if (`${user._id}` !== req.params.userId) {
            return res.status(403).send("User is not allowed to fetch this profile");
        }

        let filter: any = { user: `${user._id}` };
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;

        let _orders = await Order.find(filter)
            .sort({ email: 1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage);

        let orders = _orders.map(o => {
            let description = '';
            // if (o.gold > 0) {
            //     description += `${o.gold[0].units}M ${o.gold[0].type}`;
            // }
            // if (o.accounts.length > 0) {
            //     description += `Accounts x ${o.accounts.length}`;
            // }
            // if (o.services.length > 0) {
            //     description += `Services x ${o.services.length}`;
            // }
            // if (o.powerleveling.length > 0) {
            //     description += `Powerleveling x ${o.powerleveling.length}`;
            // }
            return {
                orderId: o._id,
                amount: o.amount,
                description
            }
        })

        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: await Order.find(filter).countDocuments(),
            orders: orders
        });
    } catch (err) {
        logDetails('error', `Error while fetching user orders: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};