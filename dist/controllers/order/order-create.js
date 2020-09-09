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
exports.createOrder = void 0;
const utils_1 = require("../../util/utils");
exports.createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ObjectId = require("mongodb").ObjectID;
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        userId = authorizedUser.id;
        // const genericTransaction = await transactionCreateOrder(req.body.currency, paymentGateway, services, powerleveling, accountsOrdered, userId, coupon, userIpAddress);
        // return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
    }
    catch (err) {
        utils_1.logDetails('error', `Error create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
});
//# sourceMappingURL=order-create.js.map