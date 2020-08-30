import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import mongoose from 'mongoose';
import * as userController from './controllers/user/user';
import * as index from './controllers/index';
import { COINBASE_API_KEY, prod, REDIS_PASSWORD, MONGODB_URI } from './util/secrets';
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
import { getCurrencies } from './api/currency-converter';
import * as currenciesController from './controllers/currencies';
export let RATES_MINIFIED: any = {}

const redisOptions = {
    // password: REDIS_PASSWORD
};
export const REDIS_CLIENT = redis.createClient(redisOptions);
const app = express();

app.use(xmlparser());

app.use(cors());

const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
export const Charge = coinbase.resources.Charge;
export const Client = coinbase.Client;
export const Webhook = coinbase.Webhook;
Client.init(COINBASE_API_KEY);
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(async () => {
        console.log('Successfully connected to mongodb');
        setUserArray(REDIS_CLIENT, '[]');
        await safeGetCurrencies();
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });



export const safeGetCurrencies = async () => {
    try {
        const response = await getCurrencies();
        const body = JSON.parse(response);
        RATES_MINIFIED = {
            USD: 1,
            EUR: body['quotes']['USDEUR'],
            CAD: body['quotes']['USDCAD'],
            CNY: body['quotes']['USDCNY'],
            NZD: body['quotes']['USDNZD']
        }

    } catch (err) {
        logDetails('error', 'Failed to load currencies' + err);
    }
};

setInterval(async () => {
    await safeGetCurrencies();
}, 60 * 60 * 1000 * 6);

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

app.post('/api/order/gold', orderController.createGoldOrder);
app.post('/api/order/account', orderController.createAccountOrder);
app.post('/api/order/services', orderController.createServicesOrder);

app.post('/api/order/services', isAuthorized, orderController.createServicesOrder);

// app.get('/api/order', isAuthorizedBelowAdmin, orderController.readOrders);
app.get('/api/order/gold', isAuthorizedBelowAdmin, orderController.readGoldOrders);
app.get('/api/order/account', isAuthorizedBelowAdmin, orderController.readAccountOrders);
app.get('/api/order/services', isAuthorizedBelowAdmin, orderController.readServicesOrders);
app.get('/api/order/:orderId', orderController.readOrder);
app.delete('/api/order/:orderId', orderController.deleteOrder);

app.put('/api/order/:orderId/gold', isAuthorizedRootAdmin, orderController.updateGoldOrder);
app.put('/api/order/:orderId/account', isAuthorizedRootAdmin, orderController.updateAccountOrder);

app.post('/api/order/:orderId/request', isAuthorizedBelowAdmin, orderController.requestOrder);


/**
 * Entities Management
 */

app.put('/api/stock', isAuthorizedRootAdmin, stockController.updateStock);
app.put('/api/rate', isAuthorizedRootAdmin, stockController.updateSwapRate);

app.post('/api/account', isAuthorizedRootAdmin, accountController.createAccount);
app.post('/api/skill', isAuthorizedRootAdmin, skillController.createSkill);
app.post('/api/service', isAuthorizedRootAdmin, serviceController.createService);

app.get('/api/account', isAuthorizedRootAdmin, accountController.readAccounts);
app.get('/api/account/available', accountController.readAvailableAccounts);


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

export default app;
