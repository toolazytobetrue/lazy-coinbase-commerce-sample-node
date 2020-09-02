import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { isArray } from "util";
import { round } from "mathjs";
import { Service } from "../../models/sales/service.model";

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.serviceId)) {
            return res.status(400).send("Service id is missing")
        }
        if (isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Service title is missing")
        }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Service price is missing")
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Service price is not a number")
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Service price cannot be zero or negative")
        }
        // if (isEmptyOrNull(req.body.description)) {
        //     return res.status(400).send("Service description is missing")
        // }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Service price is missing");
        }
        const service = await Service.findById(req.params.serviceId);
        if (!service) {
            return res.status(404).send("Service not found");
        }

        service.title = req.body.title;
        service.type = req.body.type;
        service.price = +round(req.body.price, 2);
        service.description = isEmptyOrNull(req.body.description) ? '' : req.body.description;
        service.img = isEmptyOrNull(req.body.img) ? null : req.body.img;
        await service.save();
        return res.status(200).json({ result: `Successfully updated service ${service._id} in the DB` })
    } catch (err) {
        logDetails('error', `Error updating service: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};