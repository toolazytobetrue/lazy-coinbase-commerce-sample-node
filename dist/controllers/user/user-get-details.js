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
const user_model_1 = require("../../models/user/user.model");
const user_mappings_1 = require("./user-mappings");
exports.getUserDetails = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const authorizedUser = utils_1.getAuthorizedUser(req, res, next);
        if (authorizedUser === null) {
            return res.status(401).send("Unauthorized access");
        }
        if (utils_1.isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        const user = yield user_model_1.User.findById(req.params.userId);
        if (!user) {
            return res.status(200).send(null);
        }
        if (`${user._id}` !== req.params.userId) {
            return res.status(403).send("User is not allowed to fetch this profile");
        }
        return res.status(200).json(user_mappings_1.mapToUserDocument(user));
    }
    catch (err) {
        utils_1.logDetails('error', `Error getting user details: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-get-details.js.map