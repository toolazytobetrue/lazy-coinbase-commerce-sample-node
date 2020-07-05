import mongoose, { ClientSession } from 'mongoose';
import { PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
import { Order } from '../../models/order/order.model';
import { round } from 'mathjs';
import { createCoinbaseInvoice } from '../../controllers/invoice/create-coinbase-invoice';
import { isEmptyOrNull, generateUuid } from '../../util/utils';
import { User } from '../../models/user/user.model';
import { AccountDocument } from '../../models/sales/account.model';
import { OrderStatus } from '../../models/enums/OrderStatus.enum';
import { CouponDocument } from '../../models/sales/coupon.model';
export async function transactionCreateAccountOrder(paymentGateway: PaymentGatewayDocument, account: AccountDocument, userId: string, coupon: null | undefined | CouponDocument, ipAddress: string) {
    try {
        if (!userId && paymentGateway.requiresLogin) {
            throw new Error("Payment gateway requires authentication")
        }

        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found while creating gold order");
            }
        }

        const total = account.price;
        const percentage = 100 - (coupon ? coupon.amount : 0);
        const ratio = percentage / 100;
        const totalDiscounted = +round(total * ratio, 2);

        const uuid = generateUuid();
        let _order: any = {
            uuid,
            dateCreated: new Date(),
            lastUpdated: new Date(),
            status: OrderStatus.NEW,
            paymentGateway,
            delivered: false,
            coupon,
            user: userId,
            ipAddress,
            account
        };

        switch (paymentGateway.name) {
            case 'crypto':
                const coinbaseCharge = await createCoinbaseInvoice(uuid, totalDiscounted, `${uuid}`, `Discount: ${coupon ? coupon.amount : 0}% - Account #: ${account._id}`);
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
            default:
                throw new Error("Payment gateway not found")
        }

    } catch (err) {
        throw new Error(err)
    }
}