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
exports.updateUserGroup = void 0;
const utils_1 = require("../../util/utils");
const user_model_1 = require("../../models/user/user.model");
const UserPermissions_enum_1 = require("../../models/enums/UserPermissions.enum");
exports.updateUserGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.userId)) {
            return res.status(400).send('User id is missing');
        }
        if (utils_1.isEmptyOrNull(req.body.groupId)) {
            return res.status(400).send('Group id is missing');
        }
        if (+req.body.groupId !== UserPermissions_enum_1.USER_PERMISSIONS.ADMIN && +req.body.groupId !== UserPermissions_enum_1.USER_PERMISSIONS.MODERATOR && +req.body.groupId !== UserPermissions_enum_1.USER_PERMISSIONS.WORKER && +req.body.groupId !== UserPermissions_enum_1.USER_PERMISSIONS.CUSTOMER) {
            return res.status(400).send('Group id not found');
        }
        const user = yield user_model_1.User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.groupId = req.body.groupId;
        yield user.save();
        return res.status(200).json({ result: `Successfully updated user ${user._id} group to ${user.groupId}` });
    }
    catch (err) {
        utils_1.logDetails('error', `Error updating user group id: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=user-update-group.js.map