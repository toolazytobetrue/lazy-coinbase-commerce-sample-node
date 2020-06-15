"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const user_password_reset_1 = require("./user-password-reset");
const user_login_1 = require("./user-login");
const user_email_1 = require("./user-email");
const userSchema = new mongoose_1.default.Schema({
    groupId: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    discord: { type: String, required: false },
    skype: { type: String, required: false },
    dateCreated: { type: Date, required: true },
    lastUpdated: Date,
    userEmails: [user_email_1.UserEmailSchema],
    userLogins: [user_login_1.UserLoginSchema],
    passwordResets: [user_password_reset_1.PasswordResetSchema],
    orders: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Order' }]
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