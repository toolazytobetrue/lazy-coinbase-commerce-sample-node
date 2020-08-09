import { MONGODB_URI } from "../util/secrets";
import { logDetails } from "../util/utils";
import mongoose from 'mongoose';
import { User } from "../models/user/user.model";
import { SwapRate } from "../models/sales/swap.model";
const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');
        const swapRates = await SwapRate.find();
        if (swapRates.length === 0) {
            const swapRate = await (new SwapRate({
                give: 0,
                take: 0,
                dateCreated: new Date()
            })).save();
            console.log('Successfully created swap rate');
        }
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });
