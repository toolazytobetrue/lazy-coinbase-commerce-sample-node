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
const payment_gateway_model_1 = require("../../models/entities/payment-gateway.model");
const stock_model_1 = require("../../models/sales/stock.model");
const mathjs_1 = require("mathjs");
const secrets_1 = require("../../util/secrets");
const coupon_model_1 = require("../../models/sales/coupon.model");
const create_gold_order_1 = require("../../api/order/create_gold_order");
const service_model_1 = require("../../models/sales/service.model");
const skill_model_1 = require("../../models/sales/skill.model");
const powerleveling_calculator_1 = require("../service/powerleveling-calculator");
const create_order_1 = require("../../api/order/create_order");
const account_model_1 = require("../../models/sales/account.model");
exports.createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ObjectId = require("mongodb").ObjectID;
        const userIpAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        if (utils_1.isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.currency)) {
            return res.status(400).send("Currency is missing");
        }
        if (utils_1.currencies.indexOf(req.body.currency) === -1) {
            return res.status(400).send("Currency not found");
        }
        const paymentGateway = yield payment_gateway_model_1.PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser !== null) {
            userId = authorizedUser.id;
        }
        if (paymentGateway.requiresLogin) {
            if (authorizedUser === null) {
                return res.status(401).send("Unauthorized access");
            }
        }
        let coupon;
        if (!utils_1.isEmptyOrNull(req.body.couponId)) {
            coupon = yield coupon_model_1.Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            // if (!coupon.gold) {
            //     return res.status(400).send(`Coupon is not valid for gold orders`);
            // }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }
        if (!utils_1.isEmptyOrNull(req.body.gold)) {
            const latestStock = yield stock_model_1.Stock.findOne({ paymentgateway: req.body.paymentGatewayId });
            if (!latestStock) {
                throw new Error("Last stock prices not found");
            }
            if (utils_1.isEmptyOrNull(req.body.gold.units) || isNaN(+req.body.gold.units) || +req.body.gold.units <= 0) {
                return res.status(400).send("Amount to purchase is invalid");
            }
            if (utils_1.isEmptyOrNull(req.body.gold.type)) {
                return res.status(400).send("Stock type is missing");
            }
            if (req.body.gold.type !== 'runescape3' && req.body.gold.type !== 'oldschool') {
                return res.status(400).send("Stock type is wrong");
            }
            if (utils_1.isEmptyOrNull(req.body.gold.rsn)) {
                return res.status(400).send("RSN is missing");
            }
            if (req.body.gold.rsn.length > 12) {
                return res.status(400).send("RSN cannot exceed 12 characters");
            }
            let units = +mathjs_1.round(req.body.gold.units, 2);
            let unitPrice = 0;
            if (req.body.gold.type === 'runescape3') {
                if (latestStock.rs3.units < +req.body.gold.units || latestStock.rs3.units <= 0) {
                    return res.status(400).send("Cannot order more than available in stock");
                }
                unitPrice = latestStock.rs3.selling;
            }
            else if (req.body.gold.type === 'oldschool') {
                if (latestStock.osrs.units < +req.body.gold.units || latestStock.osrs.units <= 0) {
                    return res.status(400).send("Cannot order more than available in stock");
                }
                unitPrice = latestStock.osrs.selling;
            }
            const totalOrderPrice = +mathjs_1.round(unitPrice * units, 2);
            if (secrets_1.MIN_GOLD_ORDER && totalOrderPrice < +secrets_1.MIN_GOLD_ORDER) {
                return res.status(400).send(`Minimum gold order is ${secrets_1.MIN_GOLD_ORDER} USD`);
            }
            const __rsn = req.body.gold.rsn.replace(/\s/g, '');
            if (utils_1.checkRSN(__rsn) === false) {
                return res.status(400).send("RSN is invalid");
            }
            let _rsn = req.body.gold.rsn.toLowerCase();
            let rsn = '';
            for (let i = 0; i < _rsn.length; i++) {
                if (_rsn[i] === 'l') {
                    rsn += 'L';
                }
                else {
                    rsn += _rsn[i];
                }
            }
            const order = yield create_gold_order_1.transactionCreateGoldOrder(req.body.currency, req.body.gold.type, +mathjs_1.round(req.body.gold.units, 2), latestStock, paymentGateway, rsn, coupon, userIpAddress, userId);
            return res.status(200).json({ redirect_url: order.redirect_url });
        }
        else {
            const stock = yield stock_model_1.Stock.findOne().sort({ dateCreated: -1 });
            let powerleveling = [];
            let services = [];
            let accountsOrdered = [];
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
                const serviceIds = req.body.services.map((s) => ObjectId(s));
                const servicesToFind = yield service_model_1.Service.find({
                    '_id': {
                        $in: serviceIds
                    }
                });
                req.body.services.forEach((serviceId) => {
                    const service = servicesToFind.find(x => `${x._id}` === serviceId);
                    if (service) {
                        services.push(service);
                    }
                });
                if (services.length !== req.body.services.length) {
                    return res.status(400).send("Some services are not available");
                }
            }
            if (req.body.accounts && Array.isArray(req.body.accounts) && req.body.accounts.length > 0) {
                const accountIds = req.body.accounts.map((account) => ObjectId(account.accountId));
                const tempAccounts = yield account_model_1.Account.aggregate([
                    {
                        $match: {
                            _id: {
                                $in: accountIds
                            },
                            stock: {
                                $gte: 1
                            }
                        }
                    }
                ]);
                let missingAddons = 0;
                let missingAccounts = 0;
                accountIds.forEach((accountId) => {
                    const tempAccount = tempAccounts.find(x => `${x._id}` === `${accountId}`);
                    if (tempAccount) {
                        const originalAccount = utils_1.deepClone(tempAccount);
                        if (originalAccount.stock < accountIds.filter((_) => `${_}` === `${originalAccount._id}`).length) {
                            missingAccounts++;
                        }
                        let accountToAdd = tempAccount;
                        accountToAdd.allowedAddons = [];
                        const account = req.body.accounts.find((x) => x.accountId === `${tempAccount._id}`);
                        if (account && Array.isArray(account.addons) && account.addons.length > 0) {
                            account.addons.forEach((accountAddonId) => {
                                const addon = originalAccount.allowedAddons.find(_addon => `${_addon._id}` === `${accountAddonId}`);
                                if (addon) {
                                    accountToAdd.allowedAddons.push(addon);
                                }
                                else {
                                    missingAddons++;
                                }
                            });
                        }
                        accountsOrdered.push(accountToAdd);
                    }
                    else {
                        missingAccounts++;
                    }
                });
                if (missingAccounts > 0) {
                    return res.status(400).send("Some accounts are not available in stock");
                }
                if (missingAddons > 0) {
                    return res.status(400).send("Some addons are missing");
                }
            }
            if (powerleveling.length > 0 || services.length > 0 || accountsOrdered.length > 0) {
                const genericTransaction = yield create_order_1.transactionCreateOrder(req.body.currency, paymentGateway, services, powerleveling, accountsOrdered, userId, coupon, userIpAddress);
                return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
            }
            else {
                return res.status(404).send("You need to at least choose 1 service (powerleveling/minigame/quest) or 1 account");
            }
        }
    }
    catch (err) {
        utils_1.logDetails('error', `Error create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
});
//# sourceMappingURL=order-create.js.map