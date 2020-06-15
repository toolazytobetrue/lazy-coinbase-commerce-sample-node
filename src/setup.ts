import mongoose from 'mongoose';
import { User } from './models/user/user.model';
import { MONGODB_URI, prod } from './util/secrets';
import { generateText, logDetails, generateUuid } from './util/utils';
import { PaymentGateway } from './models/entities/payment-gateway.model';
import { Stock } from './models/sales/stock.model';

const mongoUrl: string = prod ? "mongodb://bert:hassan234@localhost:27017,localhost:27018,localhost:27019/bert" : "mongodb://bert:hassan234@UKF:27017,UKF:27018,UKF:27019/bert";
const uuidv1 = require('uuid/v1');

mongoose.connect(mongoUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    replicaSet: 'rs'
})
    .then(async () => {
        const paymentGatewaysNames = [
            {
                name: 'Coinbase',
                img: 'bitcoin.png',
                fees: 0,
                requiresLogin: false,
                requiresVerification: false
            }
        ];
        const paymentGateways = await PaymentGateway.find();
        paymentGatewaysNames.forEach(async _paymentGateway => {
            const paymentGateway = paymentGateways.find(_ => _.name === _paymentGateway.name);
            if (!paymentGateway) {
                const newPaymentGateway = await (new PaymentGateway({
                    name: _paymentGateway.name,
                    img: _paymentGateway.img,
                    enabled: true,
                    dateCreated: new Date(),
                    requiresLogin: _paymentGateway.requiresLogin,
                    requiresVerification: _paymentGateway.requiresVerification,
                    fees: _paymentGateway.fees
                })).save();
                logDetails('debug', `Successfully created ${_paymentGateway.name} payment gateway`)
                console.log(`Successfully created ${_paymentGateway.name} payment gateway`)
            }
        });

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
        console.log(`Successfully created stock`)
    })
    .catch((err: string) => {
        logDetails('debug', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
    });