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
import * as orderController from './controllers/order/order';
import xmlparser from 'express-xml-bodyparser';
import redis from 'redis';
import { isAuthorizedRootAdmin, isAuthorized, isAuthorizedBelowAdmin } from './util/security';
import { setUserArray } from './api/redis-users';

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

app.post('/api/order', orderController.createOrder);
app.get('/api/order', isAuthorizedBelowAdmin, orderController.readOrders);
app.get('/api/order/:orderId', orderController.readOrder);
app.put('/api/order/:orderId', isAuthorizedBelowAdmin, orderController.updateOrder);
app.delete('/api/order/:orderId', isAuthorizedRootAdmin, orderController.deleteOrder);


/**
 * Payment Webhooks API endpoints
 */

app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);


export default app;
