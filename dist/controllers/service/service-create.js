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
exports.createService = void 0;
const utils_1 = require("../../util/utils");
const service_model_1 = require("../../models/sales/service.model");
const util_1 = require("util");
const mathjs_1 = require("mathjs");
const Services_enum_1 = require("../../models/enums/Services.enum");
exports.createService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
        if (!util_1.isArray(req.body.points)) {
            return res.status(400).send("Service points should be an array");
        }
        if (!util_1.isArray(req.body.requirements)) {
            return res.status(400).send("Service requirements should be an array");
        }
        if (Services_enum_1.ServicesEnum[req.body.type] === undefined || Services_enum_1.ServicesEnum[req.body.type] === null) {
            return res.status(400).send("Services type not found");
        }
        const service = yield (new service_model_1.Service({
            title: req.body.title,
            points: req.body.points,
            requirements: req.body.requirements,
            price: +mathjs_1.round(+req.body.price, 2),
            dateCreated: new Date(),
            type: Services_enum_1.ServicesEnum[req.body.type]
        })).save();
        return res.status(200).json({ result: 'Successfully added a new service to the DB' });
    }
    catch (err) {
        utils_1.logDetails('error', `Error adding services: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=service-create.js.map