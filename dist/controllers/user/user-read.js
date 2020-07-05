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
exports.readUsers = void 0;
const user_model_1 = require("../../models/user/user.model");
const utils_1 = require("../../util/utils");
const user_mappings_1 = require("./user-mappings");
exports.readUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!utils_1.isEmptyOrNull(req.query.pageNumber)) {
            if (isNaN(+req.query.pageNumber) || !Number.isInteger(+req.query.pageNumber)) {
                return res.status(400).send("Page number is missing");
            }
        }
        let filter = {};
        const numberPerPage = 10;
        const pageNumber = req.query.pageNumber ? +req.query.pageNumber : null;
        if (!utils_1.isEmptyOrNull(req.query.filterBy) && !utils_1.isEmptyOrNull(req.query.filter)) {
            let additionalFilter = {};
            if (req.query.filterBy == 'email') {
                additionalFilter = { email: req.query.filter };
            }
            else if (req.query.filterBy === 'firstName') {
                additionalFilter = { firstName: req.query.filter };
            }
            else if (req.query.filterBy === 'lastName') {
                additionalFilter = { lastName: req.query.filter };
            }
            filter = Object.assign(Object.assign({}, filter), additionalFilter);
        }
        let users = [];
        if (pageNumber) {
            users = yield user_model_1.User.find(filter)
                .sort({ email: 1 })
                .skip(pageNumber > 0 ? ((pageNumber - 1) * numberPerPage) : 0)
                .limit(numberPerPage);
        }
        else {
            users = yield user_model_1.User.find(filter)
                .sort({ email: 1 });
        }
        const _users = users.map(user => user_mappings_1.mapToUserDocument(user));
        return res.status(200).json({
            pageNumber,
            numberPerPage,
            totalCount: yield user_model_1.User.find(filter).countDocuments(),
            users: _users
        });
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching users: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-read.js.map