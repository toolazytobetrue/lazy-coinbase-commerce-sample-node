"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToGenericService = exports.mapToGenericPowerleveling = exports.getOrderUser = void 0;
exports.getOrderUser = (user) => {
    return user ? {
        fullName: `${user.firstName} ${user.lastName}`,
        userId: user._id,
        email: user.email,
        discord: user.discord ? user.discord : 'N/A',
        skype: user.skype ? user.skype : 'N/A'
    } : null;
};
exports.mapToGenericPowerleveling = (powerleveling, showDetails) => {
    return {
        _id: powerleveling._id,
        fromLevel: powerleveling.fromLevel,
        toLevel: powerleveling.toLevel,
        skill: powerleveling.skill,
        totalXp: powerleveling.totalXp,
        dateCreated: powerleveling.dateCreated,
        lastUpdated: powerleveling.lastUpdated,
        price: showDetails ? powerleveling.price : 'Hidden'
    };
};
exports.mapToGenericService = (service, showDetails) => {
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
    };
};
//# sourceMappingURL=services.mappings.js.map