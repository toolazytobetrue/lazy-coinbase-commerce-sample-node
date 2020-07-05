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
exports.requestOrder = void 0;
const utils_1 = require("../../util/utils");
const order_model_1 = require("../../models/order/order.model");
exports.requestOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const userId = authorizedUser ? authorizedUser.id : null;
        if (utils_1.isEmptyOrNull(req.params.orderId)) {
            return res.status(400).send("Order id is missing");
        }
        const order = yield order_model_1.Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send("Order not found");
        }
        // const workersRequested = order.requests.map((r: any) => r.worker._id);
        // if (workersRequested.indexOf(userId) >= 0) {
        //     return res.status(404).send("You've already requested to be assigned to this task, please be patient");
        // }
        // order.requests.push({
        //     dateCreated: new Date(),
        //     worker: userId
        // });
        yield order.save();
        return res.status(200).json({ result: `Successfully requested assignment to task ${order._id}` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error request task order ${err}`);
        return res.status(500).send(`Error request task order ${err.message}`);
    }
});
//# sourceMappingURL=order-request.js.map