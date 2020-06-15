"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
const order_model_1 = require("../../models/order/order.model");
const gold_mappings_1 = require("../mappings/gold-mappings");
const account_mappings_1 = require("../mappings/account-mappings");
const services_mappings_1 = require("../mappings/services.mappings");
exports.readOrders = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        if (utils_1.isEmptyOrNull(req.query.type)) {
            return res.status(400).send("Order type is missing");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        let orders = [];
        let _orders = [];
        let filter = {};
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        switch (req.query.type) {
            case 'services':
                filter = authorizedUser.groupId === UserPermissions_enum_1.USER_PERMISSIONS.WORKER ? { worker: authorizedUser.id } : {};
                filter = Object.assign({}, filter, { account: undefined, gold: undefined });
                _orders = yield order_model_1.Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                    .populate('worker')
                    .populate('requests.worker');
                orders = _orders.map(order => services_mappings_1.mapToServicesOrderDocument(order, authorizedUser.groupId !== 3));
                break;
            case 'gold':
                filter = { gold: { $ne: undefined } };
                _orders = yield order_model_1.Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                    .populate('worker');
                orders = _orders.map(order => gold_mappings_1.mapToGoldOrderDocument(order));
                break;
            case 'account':
                filter = { account: { $ne: undefined } };
                _orders = yield order_model_1.Order.find(filter)
                    .sort({ dateCreated: -1 })
                    .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                    .limit(numberPerPage)
                    .populate('user')
                    .populate('worker');
                orders = _orders.map(order => account_mappings_1.mapToAccountOrderDocument(order));
                break;
        }
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: yield order_model_1.Order.find(filter).countDocuments(),
            orders: orders
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
exports.readOrdersByCalendar = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.month) || isNaN(+req.query.month) || !Number.isInteger(+req.query.month)) {
            return res.status(400).send("Month is missing");
        }
        if (utils_1.isEmptyOrNull(req.query.year) || isNaN(+req.query.year) || !Number.isInteger(+req.query.year)) {
            return res.status(400).send("Year is missing");
        }
        let _orders = yield order_model_1.Order.find({
            $and: [
                {
                    "$expr": {
                        "$eq": [{ "$month": "$dateCreated" }, +req.query.month]
                    }
                },
                {
                    "$expr": {
                        "$eq": [{ "$year": "$dateCreated" }, +req.query.year]
                    }
                },
                {
                    gold: undefined
                },
                {
                    account: undefined
                },
                {
                    startDate: {
                        $ne: undefined
                    }
                },
                {
                    endDate: {
                        $ne: undefined
                    }
                }
            ]
        });
        let orders = _orders.map(order => services_mappings_1.mapToServicesOrderCalendarDocumentGeneric(order, false));
        return res.status(200).json(orders);
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
//# sourceMappingURL=orders-read.js.map