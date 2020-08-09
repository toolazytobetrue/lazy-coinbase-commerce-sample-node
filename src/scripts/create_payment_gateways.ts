import { MONGODB_URI, COINBASE_API_KEY } from "../util/secrets";
import { setUserArray } from "../api/redis-users";
import { logDetails } from "../util/utils";
import mongoose from 'mongoose';
import { PaymentGateway, PaymentGatewayDocument } from "../models/entities/payment-gateway.model";
import { Stock } from "../models/sales/stock.model";

const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');

        const _payment_gateways = [
            {
                name: 'crypto',
                requiresLogin: false,
                img: 'crypto.png',
                enabled: true,
                fees: 0
            },
            {
                name: 'gold',
                requiresLogin: false,
                img: 'gold.png',
                enabled: true,
                fees: 0
            }
        ]


        const available_payment_gateways = await PaymentGateway.find();
        const available_stocks = await Stock.find();
        for (let p of _payment_gateways) {
            let payment_gateway: PaymentGatewayDocument;
            if (available_payment_gateways.map(_ => _.name).indexOf(p.name) === -1) {
                payment_gateway = await new PaymentGateway({
                    name: p.name,
                    img: p.img,
                    dateCreated: new Date(),
                    enabled: p.enabled,
                    requiresLogin: p.requiresLogin,
                    fees: p.fees
                }).save();
                console.log('Successfully created paymentgateway')
            } else {
                payment_gateway = available_payment_gateways[available_payment_gateways.map(_ => _.name).indexOf(p.name)]
                console.log('Successfully used existing paymentgateway')
            }

            const available_stock = available_stocks.find(_ => `${payment_gateway._id}` === `${_.paymentgateway}`);
            if (!available_stock) {
                const stock = await (new Stock({
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
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });
