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
exports.lookupAccount = void 0;
const utils_1 = require("../../util/utils");
// import hiscores from 'osrs-json-hiscores';
exports.lookupAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (utils_1.isEmptyOrNull(req.params.rsn)) {
            return res.status(400).send("RSN is missing");
        }
        // const userHiscores = await hiscores.getStatsByGamemode(req.params.rsn, 'main');
        // return res.status(200).json(userHiscores);
    }
    catch (err) {
        utils_1.logDetails('error', `Error while fetching users: ${err}`);
        return res.status(500).send('Something wrong happened');
    }
});
//# sourceMappingURL=service-lookup-account.js.map