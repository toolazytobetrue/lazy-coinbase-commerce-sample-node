import { MONGODB_URI } from "../util/secrets";
import { logDetails } from "../util/utils";
import mongoose from 'mongoose';
import { User } from "../models/user/user.model";
const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');
        const user = await (new User({
            groupId: 1,
            email: 'admin@monkeysgold.com',
            password: 'hassan123',
            dateCreated: new Date(),
            lastUpdated: new Date(),
            firstName: 'admin',
            lastName: 'admin',
            discord: '',
            skype: '',
            userEmails: []
        })).save()
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });
