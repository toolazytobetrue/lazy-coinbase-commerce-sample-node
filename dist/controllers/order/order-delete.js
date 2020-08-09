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
exports.deleteOrder = void 0;
const utils_1 = require("../../util/utils");
const order_model_1 = require("../../models/order/order.model");
exports.deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield order_model_1.Order.deleteOne({ _id: req.params.orderId });
        return res.status(200).json({ result: `Successfully deleted order ${req.params.orderId}` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error deleting order: ${err}`);
        return res.status(500).send('Failed to delete order');
    }
});
//# sourceMappingURL=order-delete.js.map