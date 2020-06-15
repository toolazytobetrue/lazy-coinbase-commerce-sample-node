import { BlogDocument } from "../../models/blog/blog.model";
import { getOrderUser } from "./services.mappings";

export const maptoBlogDocument = (blog: BlogDocument) => {
    return {
        blogId: blog._id,
        title: blog.title,
        content: blog.content,
        author: blog.author ? getOrderUser(blog.author) : null,
        lastUpdated: blog.lastUpdated,
        dateCreated: blog.dateCreated,
    }
}