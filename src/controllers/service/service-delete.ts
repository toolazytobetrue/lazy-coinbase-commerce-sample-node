import { Request, Response, NextFunction } from "express";
import { logDetails, isEmptyOrNull } from "../../util/utils";
import { Service } from "../../models/sales/service.model";

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (isEmptyOrNull(req.params.serviceId)) {
            return res.status(400).send("Service id is missing")
        }
        const service = await Service.findById(req.params.serviceId);
        if (!service) {
            return res.status(404).send("Service not found");
        }
        await Service.deleteOne({ _id: req.params.serviceId })
        return res.status(200).json({ result: 'Successfully deleted service from the DB' })
    } catch (err) {
        logDetails('error', `Error deleting service: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
};