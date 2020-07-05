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
const mongoose_1 = __importDefault(require("mongoose"));
const secrets_1 = require("../util/secrets");
const utils_1 = require("../util/utils");
const payment_gateway_model_1 = require("../models/entities/payment-gateway.model");
const mongoUrl = secrets_1.prod ? "mongodb://bert:hassan234@localhost:27017,localhost:27018,localhost:27019/bert" : "mongodb://bert:hassan234@UKF:27017,UKF:27018,UKF:27019/bert";
const uuidv1 = require('uuid/v1');
mongoose_1.default.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    replicaSet: 'rs'
})
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const paymentGatewaysNames = [
        {
            name: 'Coinbase',
            img: 'bitcoin.png',
            fees: 0,
            requiresLogin: false,
            requiresVerification: false
        }
    ];
    const paymentGateways = yield payment_gateway_model_1.PaymentGateway.find();
    paymentGatewaysNames.forEach((_paymentGateway) => __awaiter(void 0, void 0, void 0, function* () {
        const paymentGateway = paymentGateways.find(_ => _.name === _paymentGateway.name);
        if (!paymentGateway) {
            const newPaymentGateway = yield (new payment_gateway_model_1.PaymentGateway({
                name: _paymentGateway.name,
                img: _paymentGateway.img,
                enabled: true,
                dateCreated: new Date(),
                requiresLogin: _paymentGateway.requiresLogin,
                requiresVerification: _paymentGateway.requiresVerification,
                fees: _paymentGateway.fees
            })).save();
            utils_1.logDetails('debug', `Successfully created ${_paymentGateway.name} payment gateway`);
            console.log(`Successfully created ${_paymentGateway.name} payment gateway`);
        }
    }));
    // const stock = await (new Stock({
    //     dateCreated: new Date(),
    //     rs3: {
    //         buying: 0.4,
    //         selling: 0.45,
    //         units: 2000,
    //     },
    //     osrs: {
    //         buying: 0.5,
    //         selling: 0.7,
    //         units: 2000
    //     }
    // })).save();
    // logDetails('debug', `Successfully created stock`)
    console.log(`Successfully created stock`);
}))
    .catch((err) => {
    utils_1.logDetails('debug', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
});
//# sourceMappingURL=setup.js.map