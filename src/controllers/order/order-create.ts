import { NextFunction, Request, Response } from 'express';
import { isEmptyOrNull, logDetails, getAuthorizedUser, checkRSN, currencies, deepClone } from '../../util/utils';
import { Order } from '../../models/order/order.model';
import { PaymentGateway } from '../../models/entities/payment-gateway.model';
import { Stock } from '../../models/sales/stock.model';
import { round } from 'mathjs';
import { MIN_GOLD_ORDER } from '../../util/secrets';
import { CouponDocument, Coupon } from '../../models/sales/coupon.model';
import { transactionCreateGoldOrder } from '../../api/order/create_gold_order';
import { Service, ServiceDocument } from '../../models/sales/service.model';
import { SkillDocument, Skill } from '../../models/sales/skill.model';
import { getXpDetails, getTotalPrice } from '../service/powerleveling-calculator';
import { transactionCreateOrder } from '../../api/order/create_order';
import { AccountDocument, Account } from '../../models/sales/account.model';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ObjectId = require("mongodb").ObjectID;
        const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        if (isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
        }

        if (isEmptyOrNull(req.body.currency)) {
            return res.status(400).send("Currency is missing");
        }

        if (currencies.indexOf(req.body.currency) === -1) {
            return res.status(400).send("Currency not found")
        }

        const paymentGateway = await PaymentGateway.findById(req.body.paymentGatewayId);
        if (!paymentGateway) {
            return res.status(404).send("Payment gateway not found");
        }

        const authorizedUser: any = getAuthorizedUser(req, res, next);
        if (authorizedUser !== null) {
            userId = authorizedUser.id;
        }

        if (paymentGateway.requiresLogin) {
            if (authorizedUser === null) {
                return res.status(401).send("Unauthorized access");
            }
        }

        let coupon: null | undefined | CouponDocument;
        if (!isEmptyOrNull(req.body.couponId)) {
            coupon = await Coupon.findById(req.body.couponId).sort({ dateCreated: -1 });
            if (!coupon) {
                return res.status(404).send(`Coupon not found`);
            }
            // if (!coupon.gold) {
            //     return res.status(400).send(`Coupon is not valid for gold orders`);
            // }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }

        if (!isEmptyOrNull(req.body.gold)) {
            const latestStock = await Stock.findOne({ paymentgateway: req.body.paymentGatewayId });
            if (!latestStock) {
                throw new Error("Last stock prices not found");
            }

            if (isEmptyOrNull(req.body.gold.units) || isNaN(+req.body.gold.units) || +req.body.gold.units <= 0) {
                return res.status(400).send("Amount to purchase is invalid");
            }
            if (isEmptyOrNull(req.body.gold.type)) {
                return res.status(400).send("Stock type is missing");
            }
            if (req.body.gold.type !== 'runescape3' && req.body.gold.type !== 'oldschool') {
                return res.status(400).send("Stock type is wrong");
            }
            if (isEmptyOrNull(req.body.gold.rsn)) {
                return res.status(400).send("RSN is missing");
            }
            if (req.body.gold.rsn.length > 12) {
                return res.status(400).send("RSN cannot exceed 12 characters");
            }

            let units = +round(req.body.gold.units, 2);
            let unitPrice = 0;
            if (req.body.gold.type === 'runescape3') {
                if (latestStock.rs3.units < +req.body.gold.units || latestStock.rs3.units <= 0) {
                    return res.status(400).send("Cannot order more than available in stock");
                }
                unitPrice = latestStock.rs3.selling;
            } else if (req.body.gold.type === 'oldschool') {
                if (latestStock.osrs.units < +req.body.gold.units || latestStock.osrs.units <= 0) {
                    return res.status(400).send("Cannot order more than available in stock");
                }
                unitPrice = latestStock.osrs.selling;
            }

            const totalOrderPrice = +round(unitPrice * units, 2);
            if (MIN_GOLD_ORDER && totalOrderPrice < +MIN_GOLD_ORDER) {
                return res.status(400).send(`Minimum gold order is ${MIN_GOLD_ORDER} USD`);
            }

            const __rsn = req.body.gold.rsn.replace(/\s/g, '');
            if (checkRSN(__rsn) === false) {
                return res.status(400).send("RSN is invalid")
            }

            let _rsn = req.body.gold.rsn.toLowerCase();
            let rsn = '';
            for (let i = 0; i < _rsn.length; i++) {
                if (_rsn[i] === 'l') {
                    rsn += 'L';
                } else {
                    rsn += _rsn[i]
                }
            }

            const order = await transactionCreateGoldOrder(req.body.currency, req.body.gold.type, +round(req.body.gold.units, 2), latestStock, paymentGateway, rsn, coupon, userIpAddress, userId);
            return res.status(200).json({ redirect_url: order.redirect_url });

        } else {

            const stock = await Stock.findOne().sort({ dateCreated: -1 });
            let powerleveling: { skill: SkillDocument, fromLevel: number, toLevel: number, price: number, dateCreated: Date, totalXp: number }[] = [];
            let services: ServiceDocument[] = [];
            let accountsOrdered: AccountDocument[] = [];
            if (!stock) {
                throw new Error("Last stock prices not found");
            }
            if (req.body.powerleveling && Array.isArray(req.body.powerleveling) && req.body.powerleveling.length > 0) {
                const skills = await Skill.find();
                let errors: string[] = [];
                let sumPowerlevling = 0;
                req.body.powerleveling.forEach((element: any) => {
                    if (isEmptyOrNull(element.skillId) || isEmptyOrNull(element.fromLevel) || isEmptyOrNull(element.toLevel)) {
                        errors.push('One of the powerleveling parameters is missing')
                    }
                    const skill = skills.find(s => `${s._id}` == `${element.skillId}`);
                    if (!skill) {
                        errors.push('Skill not found')
                        return;
                    }
                    const xpDetails = getXpDetails(skill, element.fromLevel, element.toLevel);
                    if (!xpDetails) {
                        errors.push("Something is wrong with the skill ranges");
                        return;
                    }
                    if (xpDetails.details.filter(d => d.pricePerXp === -1).length > 0) {
                        errors.push("Price for a specific range of that skill was not found");
                    }
                    const totalPrice = getTotalPrice(skill, element.fromLevel, element.toLevel, stock);
                    if (!totalPrice) {
                        errors.push("Something is wrong with the total price");
                        return;
                    }
                    sumPowerlevling += totalPrice.usd;
                    powerleveling.push({
                        skill,
                        fromLevel: +element.fromLevel,
                        toLevel: +element.toLevel,
                        price: +totalPrice.usd,
                        dateCreated: new Date(),
                        totalXp: +totalPrice.totalXp
                    })
                });

                if (errors.length > 0) {
                    return res.status(400).send(errors[0]);
                }

                if (powerleveling.length !== req.body.powerleveling.length) {
                    return res.send(400).send("Something went wrong while creating the pricing set");
                }
            }
            if (req.body.services && Array.isArray(req.body.services) && req.body.services.length > 0) {
                const serviceIds = req.body.services.map((s: string) => ObjectId(s));

                const servicesToFind = await Service.find({
                    '_id': {
                        $in: serviceIds
                    }
                });

                req.body.services.forEach((serviceId: string) => {
                    const service = servicesToFind.find(x => `${x._id}` === serviceId);
                    if (service) {
                        services.push(service);
                    }
                })

                if (services.length !== req.body.services.length) {
                    return res.status(400).send("Some services are not available");
                }
            }
            if (req.body.accounts && Array.isArray(req.body.accounts) && req.body.accounts.length > 0) {
                const accountIds = req.body.accounts.map((account: any) => ObjectId(account.accountId));
                const tempAccounts: AccountDocument[] = await Account.aggregate([
                    {
                        $match: {
                            _id: {
                                $in: accountIds
                            },
                            stock: {
                                $gte: 1
                            }
                        }
                    }
                ])

                let missingAddons = 0;
                let missingAccounts = 0;
                accountIds.forEach((accountId: string) => {
                    const tempAccount = tempAccounts.find(x => `${x._id}` === `${accountId}`);
                    if (tempAccount) {
                        const originalAccount = deepClone(tempAccount);
                        if (originalAccount.stock < accountIds.filter((_: string) => `${_}` === `${originalAccount._id}`).length) {
                            missingAccounts++;
                        }
                        let accountToAdd = tempAccount;
                        accountToAdd.allowedAddons = [];
                        const account = req.body.accounts.find((x: any) => x.accountId === `${tempAccount._id}`);
                        if (account && Array.isArray(account.addons) && account.addons.length > 0) {
                            account.addons.forEach((accountAddonId: string) => {
                                const addon = originalAccount.allowedAddons.find(_addon => `${_addon._id}` === `${accountAddonId}`);
                                if (addon) {
                                    accountToAdd.allowedAddons.push(addon);
                                } else {
                                    missingAddons++;
                                }
                            });
                        }
                        accountsOrdered.push(accountToAdd)
                    } else {
                        missingAccounts++;
                    }
                })

                if (missingAccounts > 0) {
                    return res.status(400).send("Some accounts are not available in stock");
                }

                if (missingAddons > 0) {
                    return res.status(400).send("Some addons are missing");
                }
            }

            if (powerleveling.length > 0 || services.length > 0 || accountsOrdered.length > 0) {
                const genericTransaction = await transactionCreateOrder(req.body.currency, paymentGateway, services, powerleveling, accountsOrdered, userId, coupon, userIpAddress);
                return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
            } else {
                return res.status(404).send("You need to at least choose 1 service (powerleveling/minigame/quest) or 1 account")
            }
        }

    } catch (err) {
        logDetails('error', `Error create order: ${err}`);
        return res.status(500).send('Failed to create order');
    }
}