"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.safeGetCurrencies = exports.Webhook = exports.Client = exports.Charge = exports.REDIS_CLIENT = exports.RATES_MINIFIED = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userController = __importStar(require("./controllers/user/user"));
const index = __importStar(require("./controllers/index"));
const secrets_1 = require("./util/secrets");
const utils_1 = require("./util/utils");
const coinbase = __importStar(require("coinbase-commerce-node"));
const webhookCoinbase = __importStar(require("./controllers/webhooks/coinbase"));
const webhookG2A = __importStar(require("./controllers/webhooks/g2a"));
const couponController = __importStar(require("./controllers/coupon/coupon"));
const paymentGatewaysController = __importStar(require("./controllers/payment-gateway/payment-gateway"));
const orderController = __importStar(require("./controllers/order/order"));
const stockController = __importStar(require("./controllers/stock/stock"));
const accountController = __importStar(require("./controllers/account/account"));
const serviceController = __importStar(require("./controllers/service/service"));
const skillController = __importStar(require("./controllers/skill/skill"));
const express_xml_bodyparser_1 = __importDefault(require("express-xml-bodyparser"));
const redis_1 = __importDefault(require("redis"));
const security_1 = require("./util/security");
const redis_users_1 = require("./api/redis-users");
const currency_converter_1 = require("./api/currency-converter");
const currenciesController = __importStar(require("./controllers/currencies"));
exports.RATES_MINIFIED = {};
const redisOptions = {
    password: secrets_1.REDIS_PASSWORD
};
exports.REDIS_CLIENT = redis_1.default.createClient(redisOptions);
const app = express_1.default();
app.use(express_xml_bodyparser_1.default());
app.use(cors_1.default());
const mongoUrl = secrets_1.MONGODB_URI ? secrets_1.MONGODB_URI : '';
exports.Charge = coinbase.resources.Charge;
exports.Client = coinbase.Client;
exports.Webhook = coinbase.Webhook;
exports.Client.init(secrets_1.COINBASE_API_KEY);
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Successfully connected to mongodb');
    redis_users_1.setUserArray(exports.REDIS_CLIENT, '[]');
    yield exports.safeGetCurrencies();
}))
    .catch((err) => {
    console.log(err);
    utils_1.logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
});
exports.safeGetCurrencies = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield currency_converter_1.getCurrencies();
        const body = JSON.parse(response);
        exports.RATES_MINIFIED = {
            USD: 1,
            EUR: body['quotes']['USDEUR'],
            CAD: body['quotes']['USDCAD'],
            CNY: body['quotes']['USDCNY'],
            NZD: body['quotes']['USDNZD']
        };
    }
    catch (err) {
        utils_1.logDetails('error', 'Failed to load currencies' + err);
    }
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.safeGetCurrencies();
}), 60 * 60 * 1000 * 6);
app.set('port', process.env.PORT || 3000);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', index.index);
/**
 * User API endpoints
 */
app.post('/api/oauth', userController.loginUser);
app.post('/api/user', userController.createUser);
app.get('/api/user', security_1.isAuthorizedRootAdmin, userController.readUsers);
app.get('/api/user/:userId', security_1.isAuthorized, userController.getUserDetails);
app.get('/api/user/:userId/order', security_1.isAuthorized, userController.getUserOrders);
app.post('/api/user/logout', security_1.isAuthorized, userController.logoutUser);
app.put('/api/user/password', security_1.isAuthorized, userController.changeUserPassword);
app.post('/api/user/password', userController.forgotUserPassword);
app.post('/api/user/password/generate', userController.generateUserPassword);
app.put('/api/user/email', security_1.isAuthorized, userController.changeUserEmail);
app.post('/api/user/email/activation/activate', userController.activateUser);
app.post('/api/user/email/activation/resend', userController.resendUserActivation);
app.put('/api/user/:userId/group', security_1.isAuthorizedRootAdmin, userController.updateUserGroup);
/**
 * Order
 */
app.post('/api/order/gold', orderController.createGoldOrder);
app.post('/api/order/account', orderController.createAccountOrder);
app.post('/api/order/services', orderController.createServicesOrder);
app.post('/api/order/services', security_1.isAuthorized, orderController.createServicesOrder);
// app.get('/api/order', isAuthorizedBelowAdmin, orderController.readOrders);
app.get('/api/order/gold', security_1.isAuthorizedBelowAdmin, orderController.readGoldOrders);
app.get('/api/order/account', security_1.isAuthorizedBelowAdmin, orderController.readAccountOrders);
app.get('/api/order/services', security_1.isAuthorizedBelowAdmin, orderController.readServicesOrders);
app.get('/api/order/:orderId', orderController.readOrder);
app.delete('/api/order/:orderId', orderController.deleteOrder);
app.put('/api/order/:orderId/gold', security_1.isAuthorizedRootAdmin, orderController.updateGoldOrder);
app.put('/api/order/:orderId/account', security_1.isAuthorizedRootAdmin, orderController.updateAccountOrder);
app.post('/api/order/:orderId/request', security_1.isAuthorizedBelowAdmin, orderController.requestOrder);
/**
 * Entities Management
 */
app.put('/api/stock', security_1.isAuthorizedRootAdmin, stockController.updateStock);
app.put('/api/rate', security_1.isAuthorizedRootAdmin, stockController.updateSwapRate);
app.post('/api/account', security_1.isAuthorizedRootAdmin, accountController.createAccount);
app.post('/api/skill', security_1.isAuthorizedRootAdmin, skillController.createSkill);
app.post('/api/service', security_1.isAuthorizedRootAdmin, serviceController.createService);
app.get('/api/account', security_1.isAuthorizedRootAdmin, accountController.readAccounts);
app.get('/api/account/available', accountController.readAvailableAccounts);
app.get('/api/service', serviceController.readServices);
app.get('/api/skill', skillController.readSkills);
app.put('/api/account/:accountId', security_1.isAuthorizedRootAdmin, accountController.updateAccount);
app.put('/api/service/:serviceId', security_1.isAuthorizedRootAdmin, serviceController.updateService);
app.put('/api/skill/:skillId', security_1.isAuthorizedRootAdmin, skillController.updateSkill);
app.delete('/api/account/:accountId', security_1.isAuthorizedRootAdmin, accountController.deleteAccount);
app.delete('/api/service/:serviceId', security_1.isAuthorizedRootAdmin, serviceController.deleteService);
app.delete('/api/skill/:skillId', security_1.isAuthorizedRootAdmin, skillController.deleteSkill);
/**
 * Coupon API endpoints
 */
app.post('/api/coupon', security_1.isAuthorizedRootAdmin, couponController.createCoupon);
app.post('/api/coupon/apply', couponController.applyCoupon);
app.get('/api/coupon', security_1.isAuthorizedRootAdmin, couponController.readCoupons);
app.put('/api/coupon/:couponId', security_1.isAuthorizedRootAdmin, couponController.updateCoupon);
app.delete('/api/coupon/:couponId', security_1.isAuthorizedRootAdmin, couponController.deleteCoupon);
/**
 * Public API endpoints
 */
app.get('/api/stock', stockController.readLatestStock);
app.get('/api/rate', stockController.readSwapRate);
app.get('/api/paymentgateway', paymentGatewaysController.read);
app.get('/api/service/powerleveling/table', serviceController.readXpTable);
app.get('/api/currencies', currenciesController.readCurrencies);
/**
 * Payment Webhooks API endpoints
 */
app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);
app.post('/api/webhooks/g2a', webhookG2A.webhookG2A);
exports.default = app;
//# sourceMappingURL=app.js.map