import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { Stock, StockDocument } from '../../models/sales/stock.model';

export const readAllStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const stocks = await Stock.find()
            .sort({ dateCreated: -1 })
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage);

        const _stock = stocks.map(stock => mapToStock(stock));
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: await Stock.find({}).countDocuments(),
            stocks: _stock
        });
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}

export const readLatestStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const latestStock = await Stock.findOne().sort({ dateCreated: -1 });
        if (!latestStock) {
            return res.status(400).send("Last stock prices not found");
        }
        return res.status(200).send(mapToStock(latestStock));
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}

export const mapToStock = (stock: StockDocument) => {
    return {
        stockId: stock._id,
        rs3: {
            buying: stock.rs3.buying,
            selling: stock.rs3.selling,
            units: stock.rs3.units
        },
        osrs: {
            buying: stock.osrs.buying,
            selling: stock.osrs.selling,
            units: stock.osrs.units
        },
        dateCreated: stock.dateCreated,
        lastUpdated: stock.lastUpdated
    }
}