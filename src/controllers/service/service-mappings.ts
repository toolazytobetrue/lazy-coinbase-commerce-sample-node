import { ServiceDocument } from "../../models/sales/service.model";

export const mapToServiceDocument = (service: ServiceDocument) => {
    return {
        serviceId: service._id,
        title: service.title,
        type: service.type,
        description: service.description,
        img: service.img,
        price: service.price,
        dateCreated: service.dateCreated,
        lastUpdated: service.lastUpdated
    }
}