import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BlogEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]); // State to hold all categories
    const [selectedCategory, setSelectedCategory] = useState(''); // State to hold selected category ID
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

    // useEffect(() => {
    //     // Fetch the existing blog details to populate the form
    //     fetch(`http://localhost:3000/blog/${id}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             const blog = data.data; // Assuming API returns the blog object
    //             setTitle(blog.title);
    //             setContent(blog.content);
    //             setCategory(blog.Category?.name || 'uncategorized'); // Set default if category is null
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setError("Failed to fetch blog details");
    //             setLoading(false);
    //         });
    //
    //
    //
    // }, [id]);
    // Fetch the blog data when the component loads
    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const blogResponse = await fetch(`http://localhost:3000/blog/${id}`);
                const blogData = await blogResponse.json();
                if (blogData.status === "success") {
                    setTitle(blogData.data.title);
                    setContent(blogData.data.content);
                    setSelectedCategory(blogData.data.categoryId || ''); // Set selected category
                } else {
                    setError('Failed to fetch blog details');
                }

                const categoryResponse = await fetch('http://localhost:3000/blog/category/get-all-categories',{
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                });
                const categoryData = await categoryResponse.json();

                if (categoryData.success) {
                    setCategories(categoryData.data);
                } else {
                    setError('Failed to fetch categories');
                }

            } catch (err) {
                setError('Error fetching blog or categories');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!token) {
            setError("You need to be logged in to update a blog");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/blog/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, categoryId: selectedCategory }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Blog updated successfully!");
                navigate(`/blog/${id}`); // Redirect to the blog detail page after successful update
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to update blog post. Please try again.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Edit Blog</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Update Blog</button>
            </form>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
};

export default BlogEdit;
