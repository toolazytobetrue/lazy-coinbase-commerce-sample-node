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
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
exports.removeUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        const user = yield user_model_1.User.findOne({ _id: req.params.userId, groupId: UserPermissions_enum_1.USER_PERMISSIONS.ADMIN });
        if (user) {
            return res.status(403).send("Unauthorized to remove root admin, contact SysAdmin to delete it");
        }
        const deleted = yield user_model_1.User.deleteOne({ _id: req.params.userId });
        return res.status(200).json({ result: `Successfully deleted user: ${req.params.userId}` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error removing user: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-remove.js.map