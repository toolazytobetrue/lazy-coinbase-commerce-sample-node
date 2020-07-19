"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateService = void 0;
const utils_1 = require("../../util/utils");
const mathjs_1 = require("mathjs");
const service_model_1 = require("../../models/sales/service.model");
exports.updateService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.serviceId)) {
            return res.status(400).send("Service id is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.title)) {
            return res.status(400).send("Service title is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Service price is missing");
        }
        if (isNaN(req.body.price)) {
            return res.status(400).send("Service price is not a number");
        }
        if (+req.body.price <= 0) {
            return res.status(400).send("Service price cannot be zero or negative");
        }
        if (utils_1.isEmptyOrNull(req.body.description)) {
            return res.status(400).send("Service description is missing");
        }
        if (utils_1.isEmptyOrNull(req.body.price)) {
            return res.status(400).send("Service price is missing");
        }
        const service = yield service_model_1.Service.findById(req.params.serviceId);
        if (!service) {
            return res.status(404).send("Service not found");
        }
        service.title = req.body.title;
        service.price = +mathjs_1.round(req.body.price, 2);
        service.description = req.body.description;
        service.img = utils_1.isEmptyOrNull(req.body.img) ? null : req.body.img;
        yield service.save();
        return res.status(200).json({ result: `Successfully updated service ${service._id} in the DB` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating service: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=service-update.js.map