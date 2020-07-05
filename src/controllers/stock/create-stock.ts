import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { Stock, StockDocument } from '../../models/sales/stock.model';
import { round } from 'mathjs';

export const updateStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.body.osrs.units) || isNaN(+req.body.osrs.units)) {
            return res.status(400).send("OSRS units is missing")
        }
        if (isEmptyOrNull(req.body.osrs.selling) || isNaN(+req.body.osrs.selling)) {
            return res.status(400).send("OSRS selling price is missing")
        }
        if (+req.body.osrs.selling <= 0) {
            return res.status(400).send("OSRS selling price cannot be zero or negative")
        }
        if (isEmptyOrNull(req.body.rs3.units) || isNaN(+req.body.rs3.units)) {
            return res.status(400).send("RS3 units is missing")
        }
        if (isEmptyOrNull(req.body.rs3.selling) || isNaN(+req.body.rs3.selling)) {
            return res.status(400).send("RS3 selling price is missing")
        }
        if (+req.body.rs3.selling <= 0) {
            return res.status(400).send("OSRS Selling price cannot be zero or negative")
        }

        // if (isEmptyOrNull(req.body.osrs.buying) || isNaN(+req.body.osrs.buying)) {
        //     return res.status(400).send("OSRS buying price is missing")
        // }
        // if (+req.body.osrs.buying <= 0) {
        //     return res.status(400).send("OSRS buying price cannot be zero or negative")
        // }
        // if (isEmptyOrNull(req.body.rs3.buying) || isNaN(+req.body.rs3.buying)) {
        //     return res.status(400).send("RS3 buying price is missing")
        // }
        // if (+req.body.rs3.buying <= 0) {
        //     return res.status(400).send("RS3 buying price cannot be zero or negative")
        // }


        const latestStock = await Stock.findOne()
            .sort({ dateCreated: -1 })
            .populate('paymentgateway')
        if (!latestStock) {
            return res.status(400).send("Last stock prices not found");
        }

        latestStock.rs3.selling = +round(req.body.rs3.selling, 2);
        latestStock.rs3.units = +round(req.body.rs3.units, 2);

        latestStock.osrs.selling = +round(req.body.osrs.selling, 2);
        latestStock.osrs.units = +round(req.body.osrs.units, 2);
        await latestStock.save();

        return res.status(200).json({ result: 'Successfully created new stock prices' });
    } catch (err) {
        logDetails('error', `Error create stock: ${err}`);
        return res.status(500).send('Failed to create stock');
    }
}