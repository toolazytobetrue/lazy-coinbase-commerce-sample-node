import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import * as userController from './controllers/user/user';
import * as index from './controllers/index';
import { COINBASE_API_KEY, prod, REDIS_PASSWORD } from './util/secrets';
import { logDetails } from './util/utils';
import * as coinbase from 'coinbase-commerce-node';
import * as webhookCoinbase from './controllers/webhooks/coinbase';
import * as webhookG2A from './controllers/webhooks/g2a';
import * as couponController from './controllers/coupon/coupon';
import * as paymentGatewaysController from './controllers/payment-gateway/payment-gateway';
import * as orderController from './controllers/order/order';
import * as stockController from './controllers/stock/stock'
import * as accountController from './controllers/account/account';
import * as serviceController from './controllers/service/service';
import * as skillController from './controllers/skill/skill';
import xmlparser from 'express-xml-bodyparser';
import redis from 'redis';
import { isAuthorizedRootAdmin, isAuthorized, isAuthorizedBelowAdmin } from './util/security';
import { setUserArray } from './api/redis-users';
const redisOptions = {
    password: REDIS_PASSWORD
};
export const REDIS_CLIENT = redis.createClient(redisOptions);
const app = express();

app.use(xmlparser());

app.use(cors());

const mongoUrl: string = prod ? "mongodb://bert:hassan123@localhost:27017,localhost:27018,localhost:27019/bert" : "mongodb://bert:hassan123@UKF:27017,UKF:27018,UKF:27019/bert";
export const Charge = coinbase.resources.Charge;
export const Client = coinbase.Client;
export const Webhook = coinbase.Webhook;
Client.init(COINBASE_API_KEY);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    replicaSet: 'rs'
}).then(async () => {
    console.log('Successfully connected to mongodb');
    setUserArray(REDIS_CLIENT, '[]');
})
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });


app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', index.index);
/**
 * User API endpoints
 */
app.post('/api/oauth', userController.loginUser);
app.post('/api/user', userController.createUser);

app.get('/api/user', isAuthorizedRootAdmin, userController.readUsers);

app.get('/api/user/:userId', isAuthorized, userController.getUserDetails);
app.get('/api/user/:userId/order', isAuthorized, userController.getUserOrders);

app.post('/api/user/logout', isAuthorized, userController.logoutUser);
app.put('/api/user/password', isAuthorized, userController.changeUserPassword);
app.post('/api/user/password', userController.forgotUserPassword);
app.post('/api/user/password/generate', userController.generateUserPassword);

app.put('/api/user/email', isAuthorized, userController.changeUserEmail);
app.post('/api/user/email/activation/activate', userController.activateUser);
app.post('/api/user/email/activation/resend', userController.resendUserActivation);

app.put('/api/user/:userId/group', isAuthorizedRootAdmin, userController.updateUserGroup);


/**
 * Order
 */

app.post('/api/order/gold', isAuthorized, orderController.createGoldOrder);
app.post('/api/order/account', isAuthorized, orderController.createAccountOrder);
app.post('/api/order/services', isAuthorized, orderController.createServicesOrder);

app.get('/api/order', isAuthorizedBelowAdmin, orderController.readOrders);
app.get('/api/order/calendar', isAuthorizedBelowAdmin, orderController.readOrdersByCalendar);

app.get('/api/order/:orderId', isAuthorizedBelowAdmin, orderController.readOrder);
app.put('/api/order/:orderId', isAuthorizedRootAdmin, orderController.updateOrder);

app.post('/api/order/:orderId/request', isAuthorizedBelowAdmin, orderController.requestOrder);


/**
 * Entities Management
 */

app.post('/api/stock', isAuthorizedRootAdmin, stockController.createStock);
app.post('/api/account', isAuthorizedRootAdmin, accountController.createAccount);
app.post('/api/service', isAuthorizedRootAdmin, serviceController.createService);
app.post('/api/skill', isAuthorizedRootAdmin, skillController.createSkill);

app.get('/api/account', accountController.readAccounts);
app.get('/api/service', serviceController.readServices);
app.get('/api/skill', skillController.readSkills);

app.put('/api/account/:accountId', isAuthorizedRootAdmin, accountController.updateAccount);
app.put('/api/service/:serviceId', isAuthorizedRootAdmin, serviceController.updateService);
app.put('/api/skill/:skillId', isAuthorizedRootAdmin, skillController.updateSkill);

app.delete('/api/account/:accountId', isAuthorizedRootAdmin, accountController.deleteAccount);
app.delete('/api/service/:serviceId', isAuthorizedRootAdmin, serviceController.deleteService);
app.delete('/api/skill/:skillId', isAuthorizedRootAdmin, skillController.deleteSkill);

/**
 * Coupon API endpoints
 */

app.post('/api/coupon', isAuthorizedRootAdmin, couponController.createCoupon);
app.post('/api/coupon/apply', couponController.applyCoupon);
app.get('/api/coupon', isAuthorizedRootAdmin, couponController.readCoupons);
app.put('/api/coupon/:couponId', isAuthorizedRootAdmin, couponController.updateCoupon);
app.delete('/api/coupon/:couponId', isAuthorizedRootAdmin, couponController.deleteCoupon);


/**
 * Private readings API endpoints
 */
app.get('/api/stock', isAuthorizedRootAdmin, stockController.readAllStock);


/**
 * Public API endpoints
 */
app.get('/api/paymentgateways', paymentGatewaysController.read);
app.get('/api/stock/latest', stockController.readLatestStock);
app.get('/api/service/powerleveling/table', serviceController.readXpTable);

/**
 * Payment Webhooks API endpoints
 */

app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);
app.post('/api/webhooks/g2a', webhookG2A.webhookG2A);

export default app;
