import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull } from '../../util/utils';
import { Stock, StockDocument } from '../../models/sales/stock.model';
import { PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
import { mapToStock } from '../mappings/all';

export const readLatestStock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _latestStock = await Stock.find()
            .sort({ dateCreated: -1 })
            .populate('paymentgateway')
        // if (!latestStock) {
        //     return res.status(400).send("Last stock prices not found");
        // }
        const latestStock = _latestStock.map(_ => mapToStock(_));
        return res.status(200).send(latestStock);
    } catch (err) {
        logDetails('error', `Error reading orders: ${err}`);
        return res.status(500).send('Failed to read orders');
    }
}
