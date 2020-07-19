"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToServiceDocument = void 0;
exports.mapToServiceDocument = (service) => {
    return {
        serviceId: service._id,
        title: service.title,
        type: service.type,
        description: service.description,
        img: service.img,
        price: service.price,
        dateCreated: service.dateCreated,
        lastUpdated: service.lastUpdated
    };
};
//# sourceMappingURL=service-mappings.js.map