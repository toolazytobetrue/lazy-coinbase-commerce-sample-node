"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maptoBlogDocument = void 0;
const services_mappings_1 = require("./services.mappings");
exports.maptoBlogDocument = (blog) => {
    return {
        blogId: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author ? services_mappings_1.getOrderUser(blog.author) : null,
        lastUpdated: blog.lastUpdated,
        dateCreated: blog.dateCreated,
    };
};
//# sourceMappingURL=blog-mapper.js.map