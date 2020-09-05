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
exports.getTotalAccountsPrice = exports.transactionCreateOrder = void 0;
const order_model_1 = require("../../models/order/order.model");
const mathjs_1 = require("mathjs");
const create_coinbase_invoice_1 = require("../../controllers/invoice/create-coinbase-invoice");
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const OrderStatus_enum_1 = require("../../models/enums/OrderStatus.enum");
const secrets_1 = require("../../util/secrets");
const app_1 = require("../../app");
function transactionCreateOrder(currency, paymentGateway, services = [], powerleveling = [], accounts, userId, coupon, ipAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!userId && paymentGateway.requiresLogin) {
                throw new Error("Payment gateway requires authentication");
            }
            const user = yield user_model_1.User.findById(userId);
            if (!user) {
                throw new Error("User not found while creating services order");
            }
            // let powerlevelingDocs: PowerlevelingDocument[] = [];
            let serviceMinigames = [];
            // if (powerleveling.length > 0) {
            //     powerlevelingDocs = await Powerleveling.create(powerleveling)
            // }
            if (services.length > 0) {
                serviceMinigames = services.map(s => {
                    return {
                        dateCreated: new Date(),
                        service: s
                    };
                });
                // serviceMinigamesDocs = await ServiceMinigame.create(serviceMinigames)
            }
            let sum = 0;
            powerleveling.forEach(powerLvling => {
                sum += powerLvling.price;
            });
            serviceMinigames.forEach(powerLvling => {
                sum += powerLvling.service.price;
            });
            const accountsTotal = exports.getTotalAccountsPrice(accounts);
            sum += accountsTotal;
            if (secrets_1.MIN_SERVICES_ORDER && +mathjs_1.round(sum, 2) < +secrets_1.MIN_SERVICES_ORDER) {
                throw new Error(`Minimum services order is ${secrets_1.MIN_SERVICES_ORDER} USD`);
            }
            if (!userId && paymentGateway.requiresLogin) {
                throw new Error("Payment gateway requires authentication");
            }
            if (userId) {
                const user = yield user_model_1.User.findById(userId);
                if (!user) {
                    throw new Error("User not found while creating gold order");
                }
            }
            const total = sum;
            const percentage = 100 - (coupon ? coupon.amount : 0);
            const ratio = percentage / 100;
            const totalDiscounted = +mathjs_1.round(total * ratio, 2);
            const totalDiscountedCurrency = +mathjs_1.round(totalDiscounted * app_1.RATES_MINIFIED[currency], 2);
            const uuid = utils_1.generateUuid();
            let _order = {
                uuid,
                dateCreated: new Date(),
                lastUpdated: new Date(),
                status: OrderStatus_enum_1.OrderStatus.NEW,
                paymentGateway,
                delivered: false,
                coupon,
                user: userId,
                ipAddress,
                powerleveling,
                services: serviceMinigames,
                accounts: accounts
            };
            switch (paymentGateway.name) {
                case 'crypto':
                    const coinbaseCharge = yield create_coinbase_invoice_1.createCoinbaseInvoice(currency, uuid, totalDiscountedCurrency, `${uuid}`, `Discount: ${coupon ? coupon.amount : 0}% - Accounts x ${accounts.length} / Services x ${services.length} / Powerleveling x ${powerleveling.length}`);
                    _order.payment = {
                        coinbase: {
                            code: coinbaseCharge.code,
                            identifier: coinbaseCharge.id
                        }
                    };
                    const order = yield (new order_model_1.Order(_order)).save();
                    return Promise.resolve({
                        redirect_url: coinbaseCharge.hosted_url
                    });
                default:
                    throw new Error("Payment gateway not found");
            }
        }
        catch (err) {
            throw new Error(err);
        }
    });
}
exports.transactionCreateOrder = transactionCreateOrder;
exports.getTotalAccountsPrice = (accounts) => {
    let total = 0;
    accounts.forEach(account => {
        total += account.price;
        account.allowedAddons.forEach(addon => {
            total += addon.price;
        });
    });
    return total;
};
//# sourceMappingURL=create_order.js.map