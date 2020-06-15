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
const order_model_1 = require("../../models/order/order.model");
const gold_mappings_1 = require("../mappings/gold-mappings");
const account_mappings_1 = require("../mappings/account-mappings");
const services_mappings_1 = require("../mappings/services.mappings");
exports.readOrder = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const order = yield order_model_1.Order.findById(req.params.orderId)
            .populate('user')
            .populate('worker')
            .populate('requests.worker');
        if (!order) {
            return res.status(404).send("Order not found");
        }
        let _order = null;
        if (order.gold) {
            _order = gold_mappings_1.mapToGoldOrderDocument(order);
        }
        else if (order.account) {
            _order = account_mappings_1.mapToAccountOrderDocument(order);
        }
        else {
            _order = services_mappings_1.mapToServicesOrderDocument(order, authorizedUser.groupId !== 3);
        }
        return res.status(200).json(_order);
    }
    catch (err) {
        utils_1.logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
});
//# sourceMappingURL=order-read.js.map