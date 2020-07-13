"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = exports.comparePass = void 0;
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_password_reset_1 = require("./user-password-reset");
const user_login_1 = require("./user-login");
const user_email_1 = require("./user-email");
const userSchema = new mongoose_1.default.Schema({
    groupId: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    userEmails: [user_email_1.UserEmailSchema],
    userLogins: [user_login_1.UserLoginSchema],
    passwordResets: [user_password_reset_1.PasswordResetSchema],
});
/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
    const user = this;
    user.lastUpdated = new Date();
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        // tslint:disable-next-line:no-shadowed-variable
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});
function comparePass(user, candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInstance = typeof user === 'string' ? yield exports.User.findOne({ email: user }) : user;
        return userInstance ? ((yield bcrypt.compare(candidatePassword, userInstance.password)) ? Promise.resolve(userInstance) : Promise.resolve(null)) : Promise.resolve(null);
    });
}
exports.comparePass = comparePass;
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=user.model.js.map