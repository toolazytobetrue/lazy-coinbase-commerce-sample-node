import { PowerlevelingDocument } from "../../models/sales/powerleveling.model";
import { ServiceMinigameDocument } from "../../models/sales/serviceminigame.model";

export const getOrderUser = (user: any) => {
    return user ? {
        fullName: `${user.firstName} ${user.lastName}`,
        userId: user._id,
        email: user.email,
        discord: user.discord ? user.discord : 'N/A',
        skype: user.skype ? user.skype : 'N/A'
    } : null;
}

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