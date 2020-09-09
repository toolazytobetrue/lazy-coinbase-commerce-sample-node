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
exports.readOrders = exports.readOrder = void 0;
const utils_1 = require("../../util/utils");
const order_model_1 = require("../../models/order/order.model");
const order_mapping_1 = require("../mappings/order-mapping");
exports.readOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const order = yield order_model_1.Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }
        return res.status(200).json(order_mapping_1.mapToOrderDocument(order));
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
exports.readOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
        return res.status(400).send("Page number is missing");
    }
    let _orders = [];
    let filter = {};
    const numberPerPage = 10;
    const pageNumber = +req.query.pageNumber;
    filter = { /**account: { $ne: undefined } */};
    _orders = yield order_model_1.Order.find()
        .sort({ dateCreated: -1 })
        .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
        .limit(numberPerPage)
        .populate('user');
    const orders = _orders.map(order => order_mapping_1.mapToOrderDocument(order));
    return res.status(200).json({
        pageNumber,
        numberPerPage,
        totalCount: yield order_model_1.Order.find(filter).countDocuments(),
        orders: orders
    });
});
//# sourceMappingURL=order-read.js.map