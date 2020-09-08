import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../util/utils';
import { Announcement } from '../models/sales/announcement.model';

export const readAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const announcement = await Announcement.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(announcement);
    } catch (err) {
        logDetails('error', `Error read announcement: ${err}`);
        return res.status(500).send('Failed to read announcement');
    }
}

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Title is missing")
        }

        if (isEmptyOrNull(req.body.enabled)) {
            return res.status(400).send("Enabled flag is missing")
        }

        const announcement = await Announcement.findOne().sort({ dateCreated: -1 });
        if (!announcement) {
            return res.status(404).send("Swap rate not found");
        }
        announcement.title = req.body.title;
        announcement.enabled = req.body.enabled === 'true' || req.body.enabled === true;
        await announcement.save();
        return res.status(200).json({ result: 'Successfully updated announcement' });
    } catch (err) {
        logDetails('error', `Error update announcement: ${err}`);
        return res.status(500).send('Failed to update announcement');
    }
}