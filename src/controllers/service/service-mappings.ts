import { ServiceDocument } from "../../models/sales/service.model";

export const mapToServiceDocument = (service: ServiceDocument) => {
    return {
        serviceId: service._id,
        title: service.title,
        type: service.type,
        points: service.points,
        requirements: service.requirements,
        price: service.price,
        dateCreated: service.dateCreated,
        lastUpdated: service.lastUpdated
    }
}