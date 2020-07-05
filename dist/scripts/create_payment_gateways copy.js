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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("../util/secrets");
const utils_1 = require("../util/utils");
const mongoose_1 = __importDefault(require("mongoose"));
const payment_gateway_model_1 = require("../models/entities/payment-gateway.model");
const stock_model_1 = require("../models/sales/stock.model");
const mongoUrl = secrets_1.MONGODB_URI ? secrets_1.MONGODB_URI : '';
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Successfully connected to mongodb');
    const _payment_gateways = [
        {
            name: 'crypto',
            requiresLogin: false,
            img: 'crypto.png',
            enabled: true,
            fees: 0
        }
    ];
    const available_payment_gateways = yield payment_gateway_model_1.PaymentGateway.find();
    const available_stocks = yield stock_model_1.Stock.find();
    for (let p of _payment_gateways) {
        let payment_gateway;
        if (available_payment_gateways.map(_ => _.name).indexOf(p.name) === -1) {
            payment_gateway = yield new payment_gateway_model_1.PaymentGateway({
                name: p.name,
                img: p.img,
                dateCreated: new Date(),
                enabled: p.enabled,
                requiresLogin: p.requiresLogin,
                fees: p.fees
            }).save();
        }
        else {
            payment_gateway = available_payment_gateways[available_payment_gateways.map(_ => _.name).indexOf(p.name)];
        }
        const available_stock = available_stocks.find(_ => payment_gateway._id === _.paymentgateway);
        if (!available_stock) {
            const stock = yield (new stock_model_1.Stock({
                dateCreated: new Date(),
                rs3: {
                    buying: 0.5,
                    selling: 0.5,
                    units: 1000
                },
                osrs: {
                    buying: 0.5,
                    selling: 0.5,
                    units: 1000
                },
                paymentgateway: payment_gateway._id
            })).save();
        }
    }
}))
    .catch((err) => {
    console.log(err);
    utils_1.logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
});
//# sourceMappingURL=create_payment_gateways copy.js.map