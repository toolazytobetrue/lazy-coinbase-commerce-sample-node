import mongoose from 'mongoose';
import { PaymentGatewayDocument } from '../../models/entities/payment-gateway.model';
import { Order } from '../../models/order/order.model';
import { round } from 'mathjs';
import { createCoinbaseInvoice } from '../../controllers/invoice/create-coinbase-invoice';
import { isEmptyOrNull, generateUuid } from '../../util/utils';
import { User } from '../../models/user/user.model';
import { ServiceDocument } from '../../models/sales/service.model';
import { Powerleveling, PowerlevelingDocument } from '../../models/sales/powerleveling.model';
import { SkillDocument } from '../../models/sales/skill.model';
import { ServiceMinigame, ServiceMinigameDocument } from '../../models/sales/serviceminigame.model';
import { OrderStatus } from '../../models/enums/OrderStatus.enum';
import { MIN_SERVICES_ORDER } from '../../util/secrets';
import { CouponDocument } from '../../models/sales/coupon.model';
import { RATES_MINIFIED } from '../../app';
import { AccountDocument } from '../../models/sales/account.model';
export async function transactionCreateOrder(currency: string, paymentGateway: PaymentGatewayDocument, services: ServiceDocument[] = [], powerleveling: { skill: SkillDocument, fromLevel: number, toLevel: number, price: number, dateCreated: Date, totalXp: number }[] = [], accounts: AccountDocument[], userId: string, coupon: null | undefined | CouponDocument, ipAddress: string) {
    try {
        if (!userId && paymentGateway.requiresLogin) {
            throw new Error("Payment gateway requires authentication")
        }

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found while creating services order");
        }

        // let powerlevelingDocs: PowerlevelingDocument[] = [];
        let serviceMinigames: any[] = [];
        // if (powerleveling.length > 0) {
        //     powerlevelingDocs = await Powerleveling.create(powerleveling)
        // }
        if (services.length > 0) {
            serviceMinigames = services.map(s => {
                return {
                    dateCreated: new Date(),
                    service: s
                }
            });
            // serviceMinigamesDocs = await ServiceMinigame.create(serviceMinigames)
        }

        let sum = 0;
        powerleveling.forEach(powerLvling => {
            sum += powerLvling.price;
        });

        serviceMinigames.forEach(powerLvling => {
            sum += powerLvling.service.price;
        });

        const accountsTotal = getTotalAccountsPrice(accounts);
        sum += accountsTotal;

        if (MIN_SERVICES_ORDER && +round(sum, 2) < +MIN_SERVICES_ORDER) {
            throw new Error(`Minimum services order is ${MIN_SERVICES_ORDER} USD`);
        }

        if (!userId && paymentGateway.requiresLogin) {
            throw new Error("Payment gateway requires authentication")
        }

        if (userId) {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found while creating gold order");
            }
        }

        const total = sum;
        const percentage = 100 - (coupon ? coupon.amount : 0);
        const ratio = percentage / 100;
        const totalDiscounted = +round(total * ratio, 2);
        const totalDiscountedCurrency = +round(totalDiscounted * RATES_MINIFIED[currency], 2)

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
            powerleveling,
            services: serviceMinigames,
            accounts: accounts
        };

        switch (paymentGateway.name) {
            case 'crypto':
                const coinbaseCharge = await createCoinbaseInvoice(currency, uuid, totalDiscountedCurrency, `${uuid}`, `Discount: ${coupon ? coupon.amount : 0}% - Accounts x ${accounts.length} / Services x ${services.length} / Powerleveling x ${powerleveling.length}`);
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


export const getTotalAccountsPrice = (accounts: AccountDocument[]) => {
    let total = 0;
    accounts.forEach(account => {
        total += account.price;

        account.allowedAddons.forEach(addon => {
            total += addon.price;
        })
    })
    return total;
}