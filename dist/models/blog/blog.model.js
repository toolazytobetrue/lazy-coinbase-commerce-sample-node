"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BlogSchema = new mongoose_1.default.Schema({
    dateCreated: { type: Date, required: true },
    lastUpdated: { type: Date, required: false },
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
});
BlogSchema.pre('save', function save(next) {
    const blog = this;
    blog.lastUpdated = new Date();
    next();
});
exports.Blog = mongoose_1.default.model('Blog', BlogSchema);
//# sourceMappingURL=blog.model.js.map