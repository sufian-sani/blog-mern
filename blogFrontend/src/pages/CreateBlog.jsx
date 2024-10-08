import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(''); // Category selected by the user
    const navigate = useNavigate();

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        // Fetch all categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/blog/category/get-all-categories',{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Send the token in the headers
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (err) {
                setError('Failed to load categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // const token = localStorage.getItem("authToken"); // Assuming the token is stored in localStorage

        if (!token) {
            setError("You need to be logged in to create a blog");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/blog", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send the token in the headers
                },
                body: JSON.stringify({ title, content, categoryId }), // Send the blog data in the body
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Blog created successfully!");
                setError("");
                navigate("/"); // Redirect to the home page or blog listing page
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    // console.log(categories)

    return (
        <div>
            <h2>Create Blog</h2>
            <form onSubmit={handleSubmit}>
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
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {/* Default to uncategorized */}
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Create Blog</button>
                {message && <p style={{color: "green"}}>{message}</p>}
                {error && <p style={{color: "red"}}>{error}</p>}
            </form>
        </div>
    );
};

export default CreateBlog;
