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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("../util/secrets");
const utils_1 = require("../util/utils");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../models/user/user.model");
const mongoUrl = secrets_1.MONGODB_URI ? secrets_1.MONGODB_URI : '';
mongoose_1.default.set('useCreateIndex', true);
mongoose_1.default.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Successfully connected to mongodb');
    const user = yield (new user_model_1.User({
        groupId: 1,
        email: 'admin@bert.com',
        password: 'hassan123',
        dateCreated: new Date(),
        lastUpdated: new Date(),
        firstName: 'admin',
        lastName: 'admin',
        discord: '',
        skype: '',
        userEmails: []
    })).save();
}))
    .catch((err) => {
    console.log(err);
    utils_1.logDetails('error', 'MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
});
//# sourceMappingURL=create_admin.js.map