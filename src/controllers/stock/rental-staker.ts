import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { round } from 'mathjs';
import { StakerRental } from '../../models/sales/rental.model';

export const readStakerRental = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stakerRental = await StakerRental.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(stakerRental);
    } catch (err) {
        logDetails('error', `Error read staker rentals: ${err}`);
        return res.status(500).send('Failed to read staker rentals');
    }
}

export const updateStakerRental = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.usd) || isNaN(+req.body.usd)) {
            return res.status(400).send("USD number is missing")
        }
        if (isEmptyOrNull(req.body.gold) || isNaN(+req.body.gold)) {
            return res.status(400).send("Gold number is missing")
        }
        if (+req.body.usd <= 0) {
            return res.status(400).send("USD number cannot be zero or negative")
        }
        if (+req.body.gold <= 0) {
            return res.status(400).send("Gold number cannot be zero or negative")
        }

        const stakerRental = await StakerRental.findOne().sort({ dateCreated: -1 });
        if (!stakerRental) {
            return res.status(404).send("Staker rental rate not found");
        }
        stakerRental.usd = +round(+req.body.usd, 2);
        stakerRental.gold = +round(+req.body.gold, 2);
        await stakerRental.save();
        return res.status(200).json({ result: 'Successfully updated staker rentals' });
    } catch (err) {
        logDetails('error', `Error update staker rentals: ${err}`);
        return res.status(500).send('Failed to update staker rentals');
    }
}