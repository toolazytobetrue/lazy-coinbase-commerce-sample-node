import { MONGODB_URI } from "../util/secrets";
import { logDetails } from "../util/utils";
import mongoose from 'mongoose';
import { Announcement } from "../models/sales/announcement.model";
const mongoUrl: string = MONGODB_URI ? MONGODB_URI : '';
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Successfully connected to mongodb');
        const announcements = await Announcement.find();
        if (announcements.length === 0) {
            const announcement = await (new Announcement({
                title: 'Test',
                enabled: false,
                dateCreated: new Date()
            })).save();
            console.log('Successfully created announcement');
        }
    })
    .catch((err: string) => {
        console.log(err)
        logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
        process.exit(1);
    });
