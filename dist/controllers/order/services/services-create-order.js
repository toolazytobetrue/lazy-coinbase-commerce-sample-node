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
exports.createServicesOrder = void 0;
const utils_1 = require("../../../util/utils");
const payment_gateway_model_1 = require("../../../models/entities/payment-gateway.model");
const stock_model_1 = require("../../../models/sales/stock.model");
const skill_model_1 = require("../../../models/sales/skill.model");
const powerleveling_calculator_1 = require("../../service/powerleveling-calculator");
const service_model_1 = require("../../../models/sales/service.model");
const coupon_model_1 = require("../../../models/sales/coupon.model");
const create_service_1 = require("../../../api/order/create_service");
exports.createServicesOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        const userId = authorizedUser ? authorizedUser.id : null;
        if (utils_1.isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }
        const paymentGateway = yield payment_gateway_model_1.PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }
        let coupon;
        if (!utils_1.isEmptyOrNull(req.body.couponId)) {
            coupon = yield coupon_model_1.Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            if (!coupon.services) {
                return res.status(400).send(`Coupon is not valid for services orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        const stock = yield stock_model_1.Stock.findOne().sort({ dateCreated: -1 });
        let powerleveling = [];
        let services = [];
        if (!stock) {
            throw new Error("Last stock prices not found");
        }
        if (req.body.powerleveling && Array.isArray(req.body.powerleveling) && req.body.powerleveling.length > 0) {
            const skills = yield skill_model_1.Skill.find();
            let errors = [];
            let sumPowerlevling = 0;
            req.body.powerleveling.forEach((element) => {
                if (utils_1.isEmptyOrNull(element.skillId) || utils_1.isEmptyOrNull(element.fromLevel) || utils_1.isEmptyOrNull(element.toLevel)) {
                    errors.push('One of the powerleveling parameters is missing');
                }
                const skill = skills.find(s => `${s._id}` == `${element.skillId}`);
                if (!skill) {
                    errors.push('Skill not found');
                    return;
                }
                const xpDetails = powerleveling_calculator_1.getXpDetails(skill, element.fromLevel, element.toLevel);
                if (!xpDetails) {
                    errors.push("Something is wrong with the skill ranges");
                    return;
                }
                if (xpDetails.details.filter(d => d.pricePerXp === -1).length > 0) {
                    errors.push("Price for a specific range of that skill was not found");
                }
                const totalPrice = powerleveling_calculator_1.getTotalPrice(skill, element.fromLevel, element.toLevel, stock);
                if (!totalPrice) {
                    errors.push("Something is wrong with the total price");
                    return;
                }
                sumPowerlevling += totalPrice.usd;
                powerleveling.push({
                    skill,
                    fromLevel: +element.fromLevel,
                    toLevel: +element.toLevel,
                    price: +totalPrice.usd,
                    dateCreated: new Date(),
                    totalXp: +totalPrice.totalXp
                });
            });
            if (errors.length > 0) {
                return res.status(400).send(errors[0]);
            }
            if (powerleveling.length !== req.body.powerleveling.length) {
                return res.send(400).send("Something went wrong while creating the pricing set");
            }
        }
        if (req.body.services && Array.isArray(req.body.services) && req.body.services.length > 0) {
            const serviceIds = [];
            let errors = [];
            req.body.services.forEach((element) => {
                if (typeof element === 'string') {
                    serviceIds.push(element);
                }
                else {
                    errors.push('Service id is missing');
                }
            });
            if (errors.length > 0) {
                return res.send(400).send(errors[0]);
            }
            const servicesToFind = yield service_model_1.Service.find({
                '_id': {
                    $in: serviceIds
                }
            });
            if (servicesToFind.length !== serviceIds.length) {
                return res.status(404).send("Some services couldn't be found");
            }
            services = servicesToFind;
        }
        if (powerleveling.length > 0 || services.length > 0) {
            const genericTransaction = yield create_service_1.transactionCreateServicesOrder(paymentGateway, services, powerleveling, userId, coupon, userIpAddress);
            return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
        }
        else {
            return res.status(404).send("You need to at least choose 1 service (powerleveling/minigame/quest)");
        }
    }
    catch (err) {
        utils_1.logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
});
//# sourceMappingURL=services-create-order.js.map