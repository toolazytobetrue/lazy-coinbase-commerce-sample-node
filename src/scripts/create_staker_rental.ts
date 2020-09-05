import { MONGODB_URI } from "../util/secrets";
import { logDetails } from "../util/utils";
import mongoose from 'mongoose';
import { StakerRental } from "../models/sales/rental.model";
const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');
        const stakerRentals = await StakerRental.find();
        if (stakerRentals.length === 0) {
            const stakerRental = await (new StakerRental({
                gold: 0,
                usd: 0,
                dateCreated: new Date()
            })).save();
            console.log('Successfully created staker rental');
        }
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });
