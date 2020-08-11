import { Request, Response, NextFunction } from 'express';
import { logDetails } from '../util/utils';
import { RATES_MINIFIED } from '../app';

export const readCurrencies = async (req: Request, res: Response) => {
    try {
        return res.status(200).json(RATES_MINIFIED);
    } catch (err) {
        logDetails('error', `Error reading currencies: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};