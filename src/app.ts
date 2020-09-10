import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction } from 'express';
import * as index from './controllers/index';
import { COINBASE_API_KEY } from './util/secrets';
import * as coinbase from 'coinbase-commerce-node';
import * as webhookCoinbase from './controllers/webhooks/coinbase';
import * as orderController from './controllers/order/order';

const app = express();
app.use(cors());

export const Charge = coinbase.resources.Charge;
export const Client = coinbase.Client;
export const Webhook = coinbase.Webhook;
Client.init(COINBASE_API_KEY);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', index.index);

/**
 * Order
 */

app.post('/api/order', orderController.createOrder);


/**
 * Payment Webhooks API endpoints
 */

app.post('/api/webhooks/coinbase', webhookCoinbase.webhookCoinbase);


export default app;
