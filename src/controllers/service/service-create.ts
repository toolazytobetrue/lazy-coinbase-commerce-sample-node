import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Service } from "../../models/sales/service.model";
import { isArray } from "util";
import { round } from "mathjs";
import { ServicesEnum } from "../../models/enums/Services.enum";

export const createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
        if (isEmptyOrNull(req.body.description)) {
            return res.status(400).send("Service description is missing")
        }
        if (isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Service price is missing");
        }
        if (ServicesEnum[req.body.type] === undefined || ServicesEnum[req.body.type] === null) {
            return res.status(400).send("Services type not found")
        }
        const service = await (new Service({
            title: req.body.title,
            description: req.body.description,
            img: req.body.img,
            price: +round(+req.body.price, 2),
            dateCreated: new Date(),
            type: +req.body.type
        })).save()
        return res.status(200).json({ result: 'Successfully added a new service to the DB' })
    } catch (err) {
        logDetails('error', `Error adding services: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};