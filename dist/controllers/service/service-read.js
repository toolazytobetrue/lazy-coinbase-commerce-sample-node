"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../util/utils");
const service_model_1 = require("../../models/sales/service.model");
const service_mappings_1 = require("./service-mappings");
exports.readServices = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.query.pageNumber) || isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
            return res.status(400).send("Page number is missing");
        }
        if (utils_1.isEmptyOrNull(req.query.type) || isNaN(+req.query.type) || !Number.isInteger(+req.query.type)) {
            return res.status(400).send("Type is missing");
        }
        if (utils_1.isEmptyOrNull(req.query.type) || isNaN(+req.query.type) || !Number.isInteger(+req.query.type)) {
            return res.status(400).send("Type is missing");
        }
        const numberPerPage = 10;
        const pageNumber = +req.query.pageNumber;
        const objectToFind = utils_1.isEmptyOrNull(req.query.title) ? { type: +req.query.type } : { type: +req.query.type, title: { '$regex': req.query.title, $options: 'i' } };
        const services = yield service_model_1.Service.find(objectToFind)
            .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
            .limit(numberPerPage)
            .sort({ dateCreated: -1 });
        const _services = services.map(service => service_mappings_1.mapToServiceDocument(service));
        return res.status(200).send({
            pageNumber,
            numberPerPage,
            totalCount: yield service_model_1.Service.find(objectToFind).countDocuments(),
            services: _services
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching services: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=service-read.js.map