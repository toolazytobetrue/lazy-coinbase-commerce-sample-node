"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
    console.log('Successfully connected to mongodb');
    redis_users_1.setUserArray(exports.REDIS_CLIENT, '[]');
})
    .catch((err) => {
    console.log(err);
    utils_1.logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
});
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
app.post('/api/order/gold', security_1.isAuthorized, orderController.createGoldOrder);
app.post('/api/order/account', security_1.isAuthorized, orderController.createAccountOrder);
app.post('/api/order/services', security_1.isAuthorized, orderController.createServicesOrder);
app.get('/api/order', security_1.isAuthorizedBelowAdmin, orderController.readOrders);
app.get('/api/order/calendar', security_1.isAuthorizedBelowAdmin, orderController.readOrdersByCalendar);
app.get('/api/order/:orderId', security_1.isAuthorizedBelowAdmin, orderController.readOrder);
app.put('/api/order/:orderId', security_1.isAuthorizedRootAdmin, orderController.updateOrder);
app.post('/api/order/:orderId/request', security_1.isAuthorizedBelowAdmin, orderController.requestOrder);
/**
 * Entities Management
 */
app.post('/api/stock', security_1.isAuthorizedRootAdmin, stockController.createStock);
app.post('/api/account', security_1.isAuthorizedRootAdmin, accountController.createAccount);
app.post('/api/service', security_1.isAuthorizedRootAdmin, serviceController.createService);
app.post('/api/skill', security_1.isAuthorizedRootAdmin, skillController.createSkill);
app.get('/api/account', accountController.readAccounts);
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
app.get('/api/stock', stockController.readAllStock);
app.get('/api/paymentgateway', paymentGatewaysController.read);
app.get('/api/stock/latest', stockController.readLatestStock);
app.get('/api/service/powerleveling/table', serviceController.readXpTable);
/**
 * Payment Webhooks API endpoints
 */
app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);
app.post('/api/webhooks/g2a', webhookG2A.webhookG2A);
exports.default = app;
//# sourceMappingURL=app.js.map