"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrders = void 0;
const user_model_1 = require("../../models/user/user.model");
const utils_1 = require("../../util/utils");
const order_model_1 = require("../../models/order/order.model");
exports.getUserOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const user = yield user_model_1.User.findById(req.params.userId);
        if (!user) {
            return res.status(200).send(null);
        }
        if (`${user._id}` !== req.params.userId) {
            return res.status(403).send("User is not allowed to fetch this profile");
        }
        let filter = { user: `${user._id}` };
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        let _orders = yield order_model_1.Order.find(filter)
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
                // amount: o.amount,
                description
            };
        });
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: yield order_model_1.Order.find(filter).countDocuments(),
            orders: orders
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching user orders: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-read-order.js.map