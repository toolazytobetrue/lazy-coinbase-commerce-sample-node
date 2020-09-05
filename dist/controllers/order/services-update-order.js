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
exports.updateServicesOrder = void 0;
const utils_1 = require("../../../util/utils");
const order_model_1 = require("../../../models/order/order.model");
exports.updateServicesOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.orderId) || !utils_1.isDbObjectId(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }
        const order = yield order_model_1.Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }
        order.delivered = !order.delivered;
        yield order.save();
        return res.status(200).json({ result: `Successfully updated order ${order._id}` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating an order ${err}`);
        return res.status(500).send('Failed to update an order');
    }
});
//# sourceMappingURL=services-update-order.js.map