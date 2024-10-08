import { Link } from "react-router-dom";

const truncateContent = (content, length) => {
    if (content.length <= length) return content;
    return content.substring(0, length) + "...";
};

const BlogList = ({ blogs }) => {
    return (
        <ul>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <li key={blog.id}>
                        <Link to={`/blog/${blog.id}`}>
                            <h2>{blog.title}</h2>
                            <p>{truncateContent(blog.content, 5)}</p>
                        </Link>
                    </li>
                ))
            ) : (
                <p>No blogs available</p>
            )}
        </ul>
    );
};

export default BlogList;