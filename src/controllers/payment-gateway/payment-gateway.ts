import { Request, Response } from 'express';
import { logDetails } from '../../util/utils';
import { PaymentGateway, PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
export const read = async (req: Request, res: Response) => {
    try {
        const payments = await PaymentGateway.find();
        const all = payments.map((paymentGateway: PaymentGatewayDocument) => {
            return {
                paymentGatewayId: paymentGateway._id,
                name: paymentGateway.name,
                lastUpdated: paymentGateway.lastUpdated,
                dateCreated: paymentGateway.dateCreated,
                requiresLogin: paymentGateway.requiresLogin,
                requiresVerification: paymentGateway.requiresVerification,
                img: paymentGateway.img,
                enabled: paymentGateway.enabled,
                fees: paymentGateway.fees
            };
        });
        return res.status(200).send(all);
    } catch (err) {
        logDetails('error', `Error fetching payment: ${err}`);
        return res.status(500).send('Failed to fetch payment');
    }
}; 