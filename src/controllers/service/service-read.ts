import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Service } from "../../models/sales/service.model";
import { mapToServiceDocument } from "./service-mappings";

export const readServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing")
        }

        if (isEmptyOrNull(req.query.type) || isNaN(+req.query.type) || !Number.isInteger(+req.query.type)) {
            return res.status(400).send("Type is missing")
        }

        if (isEmptyOrNull(req.query.type) || isNaN(+req.query.type) || !Number.isInteger(+req.query.type)) {
            return res.status(400).send("Type is missing")
        }

        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;

        const objectToFind = isEmptyOrNull(req.query.title) ? { type: +req.query.type } : { type: +req.query.type, title: { '$regex': req.query.title, $options: 'i' } };
        const services = await Service.find(objectToFind)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });

        const _services = services.map(service => mapToServiceDocument(service));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: await Service.find(objectToFind).countDocuments(),
            services: _services
        });
    } catch (err) {
        logDetails('error', `Error while fetching services: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};