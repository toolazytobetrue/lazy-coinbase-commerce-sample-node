import { NextFunction, Request, Response } from 'express';
import { logDetails, isEmptyOrNull, getAuthorizedUser } from '../../../util/utils';
import { PaymentGateway } from '../../../models/entities/payment-gateway.model';
import { Stock } from '../../../models/sales/stock.model';
import { Skill, SkillDocument } from '../../../models/sales/skill.model';
import { getXpDetails, getTotalPrice } from '../../service/powerleveling-calculator';
import { ServiceDocument, Service } from '../../../models/sales/service.model';
import { CouponDocument, Coupon } from '../../../models/sales/coupon.model';
import { transactionCreateServicesOrder } from '../../../api/order/create_service';

export const createServicesOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userIpAddress: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        let userId = null;
        if (isEmptyOrNull(req.body.paymentGatewayId)) {
            return res.status(400).send("Payment type is missing");
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
            if (!coupon.services) {
                return res.status(400).send(`Coupon is not valid for services orders`);
            }
            if (!coupon.enabled) {
                return res.status(400).send(`Coupon is disabled`);
            }
        }

        const stock = await Stock.findOne().sort({ dateCreated: -1 });
        let powerleveling: { skill: SkillDocument, fromLevel: number, toLevel: number, price: number, dateCreated: Date, totalXp: number }[] = [];
        let services: ServiceDocument[] = [];
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
            const serviceIds: string[] = [];
            let errors: string[] = [];
            req.body.services.map((s: any) => s.serviceId).forEach((element: any) => {
                if (typeof element === 'string') {
                    serviceIds.push(element);
                } else {
                    errors.push('Service id is missing')
                }
            });

            if (errors.length > 0) {
                return res.send(400).send(errors[0]);
            }

            const servicesToFind = await Service.find({
                '_id': {
                    $in: serviceIds
                }
            });

            servicesToFind.forEach(s => {
                const servicesFoundLength = req.body.services.filter((_: any) => `${_.serviceId}` === `${s._id}`).length;
                services = [...services, ...new Array(servicesFoundLength).fill(s)];
            })
        }

        if (powerleveling.length > 0 || services.length > 0) {
            const genericTransaction = await transactionCreateServicesOrder(paymentGateway, services, powerleveling, userId, coupon, userIpAddress);
            return res.status(200).json({ redirect_url: genericTransaction.redirect_url });
        } else {
            return res.status(404).send("You need to at least choose 1 service (powerleveling/minigame/quest)")
        }
    } catch (err) {
        logDetails('error', `Error creating an order ${err}`);
        return res.status(400).send(err.message);
    }
} 