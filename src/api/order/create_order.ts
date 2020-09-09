import mongoose from 'mongoose';
import { Order } from '../../models/order/order.model';
import { createCoinbaseInvoice } from '../../controllers/invoice/create-coinbase-invoice';
import { isEmptyOrNull, generateUuid } from '../../util/utils';
import { User } from '../../models/user/user.model';
import { OrderStatus } from '../../models/enums/OrderStatus.enum';

export async function transactionCreateOrder(price: number, userId: mongoose.Types.ObjectId, ipAddress: string) {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found while creating services order");
        }

        // const percentage = 100 - (coupon ? coupon.amount : 0);
        // const ratio = percentage / 100;
        // const totalDiscounted = +round(total * ratio, 2);
        // const totalDiscountedCurrency = +round(totalDiscounted * RATES_MINIFIED[currency], 2)

        const uuid = generateUuid();
        let _order: any = {
            uuid,
            dateCreated: new Date(),
            lastUpdated: new Date(),
            status: OrderStatus.NEW,
            delivered: false,
            user: userId,
            ipAddress
        };

        const coinbaseCharge = await createCoinbaseInvoice(uuid, price, `Web Development`, `UUID: ${uuid}`);
        _order.payment = {
            coinbase: {
                code: coinbaseCharge.code,
                identifier: coinbaseCharge.id
            }
        }

        const order = await (new Order(_order)).save();
        return Promise.resolve({
            redirect_url: coinbaseCharge.hosted_url
        });
    } catch (err) {
        throw new Error(err)
    }
} 