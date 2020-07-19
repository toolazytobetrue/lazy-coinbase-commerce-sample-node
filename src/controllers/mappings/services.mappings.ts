import { OrderDocument } from "../../models/order/order.model";
import { PowerlevelingDocument } from "../../models/sales/powerleveling.model";
import { ServiceDocument } from "../../models/sales/service.model";
import { ServiceMinigameDocument } from "../../models/sales/serviceminigame.model";
import { maptoCouponDocument } from "./coupon-mapper";

// export const mapToServicesOrderDocument = (order: OrderDocument, showDetails: boolean) => {
//     const {
//         amount,
//         amountWithDiscount,
//         delivered,
//         rsn,
//         status,
//         lastUpdated,
//         dateCreated,
//         startDate,
//         endDate,
//         coupon,
//         ipAddress
//     } = order;
//     return {
//         orderId: `${order._id}`,
//         delivered,
//         rsn,
//         lastUpdated,
//         dateCreated,
//         amount: showDetails ? amount : 'Hidden',
//         amountWithDiscount: showDetails ? amountWithDiscount : 'Hidden',
//         status,
//         payment: getPaymentMap(order, showDetails),
//         details: {
//             hasServicesOrder: order.services.length > 0,
//             hasPowerlevelingOrder: order.powerleveling.length > 0,
//             servicesOrder: order.services.map(s => mapToGenericService(s, showDetails)),
//             powerlevelingOrder: order.powerleveling.map(p => mapToGenericPowerleveling(p, showDetails))
//         },
//         user: getOrderUser(order.user),
//         worker: getOrderWorker(order.worker),
//         payout: order.payout ? order.payout : 0,
//         canBeRequested: !order.worker,
//         startDate: startDate ? startDate : null,
//         endDate: endDate ? endDate : null,
//         requests: showDetails ? order.requests.map((r: any) => {
//             return {
//                 dateCreated: r.dateCreated,
//                 worker: r.worker ? getOrderWorker(r.worker) : null
//             }
//         }) : null,
//         ipAddress: showDetails ? ipAddress : 'N/A',
//         coupon: showDetails && coupon ? maptoCouponDocument(coupon) : null
//     }
// }

export const getOrderUser = (user: any) => {
    return user ? {
        fullName: `${user.firstName} ${user.lastName}`,
        userId: user._id,
        email: user.email,
        discord: user.discord ? user.discord : 'N/A',
        skype: user.skype ? user.skype : 'N/A'
    } : null;
}

export const getOrderWorker = (worker: any) => {
    return worker ? {
        fullName: `${worker.firstName} ${worker.lastName}`,
        workerId: worker._id,
        email: worker.email,
        discord: worker.discord ? worker.discord : 'N/A',
        skype: worker.skype ? worker.skype : 'N/A'
    } : null
}

// export const mapToServicesOrderCalendarDocumentGeneric = (order: OrderDocument, showDetails: boolean) => {
//     let description = `Payout: $${order.payout ? order.payout : 0}\n`;
//     if (order.services.length > 0) {
//         description += `Services x ${order.services.length}\n`;
//     }
//     if (order.powerleveling.length > 0) {
//         description += `Powerleveling x ${order.powerleveling.length}`;
//     }
//     return {
//         orderId: `${order._id}`,
//         title: description,
//         startDate: order.startDate ? order.startDate : null,
//         endDate: order.endDate ? order.endDate : null,
//         canBeRequested: !order.worker,
//         delivered: order.delivered,
//         lastUpdated: order.lastUpdated,
//         dateCreated: order.dateCreated,
//         payout: order.payout ? order.payout : 0,
//         status: order.status,
//         details: {
//             hasServicesOrder: order.services.length > 0,
//             hasPowerlevelingOrder: order.powerleveling.length > 0,
//             servicesOrder: order.services.map(s => mapToGenericService(s, showDetails)),
//             powerlevelingOrder: order.powerleveling.map(p => mapToGenericPowerleveling(p, showDetails))
//         },
//     }
// }

export const mapToGenericPowerleveling = (powerleveling: PowerlevelingDocument, showDetails: boolean) => {
    return {
        _id: powerleveling._id,
        fromLevel: powerleveling.fromLevel,
        toLevel: powerleveling.toLevel,
        skill: powerleveling.skill,
        totalXp: powerleveling.totalXp,
        dateCreated: powerleveling.dateCreated,
        lastUpdated: powerleveling.lastUpdated,
        price: showDetails ? powerleveling.price : 'Hidden'
    }
}

export const mapToGenericService = (service: ServiceMinigameDocument, showDetails: boolean) => {
    return {
        _id: service._id,
        dateCreated: service.dateCreated,
        lastUpdated: service.dateCreated,
        service: {
            _id: service.service._id,
            title: service.service.title,
            type: service.service.type,
            description: service.service.description,
            img: service.service.img,
            price: showDetails ? service.service.price : 'Hidden',
            dateCreated: service.service.dateCreated,
            lastUpdated: service.service.lastUpdated,
        }
    }
}