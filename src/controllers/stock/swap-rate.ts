import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { round } from 'mathjs';
import { SwapRate } from '../../models/sales/swap.model';

export const readSwapRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const swapRate = await SwapRate.findOne().sort({ dateCreated: -1 });
        return res.status(200).json(swapRate);
    } catch (err) {
        logDetails('error', `Error read swap rates: ${err}`);
        return res.status(500).send('Failed to read swap rates');
    }
}

export const updateSwapRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.take) || isNaN(+req.body.take)) {
            return res.status(400).send("Take number is missing")
        }
        if (isEmptyOrNull(req.body.give) || isNaN(+req.body.give)) {
            return res.status(400).send("Give number is missing")
        }
        if (+req.body.take <= 0) {
            return res.status(400).send("Take number cannot be zero or negative")
        }
        if (+req.body.give <= 0) {
            return res.status(400).send("Give number cannot be zero or negative")
        }

        const swapRate = await SwapRate.findOne().sort({ dateCreated: -1 });
        if (!swapRate) {
            return res.status(404).send("Swap rate not found");
        }
        swapRate.take = +round(+req.body.take, 2);
        swapRate.give = +round(+req.body.give, 2);
        await swapRate.save();
        return res.status(200).json({ result: 'Successfully updated swap rates' });
    } catch (err) {
        logDetails('error', `Error update swap rates: ${err}`);
        return res.status(500).send('Failed to update swap rates');
    }
}