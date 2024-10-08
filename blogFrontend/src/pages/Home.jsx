import React, { useEffect, useState }  from "react";
import blogs from "../data.js";
import BlogList from "../components/BlogList.jsx";

const Home = () => {
    const [blogs, setBlogs] = useState([]); // State to store fetched blogs
    const [loading, setLoading] = useState(true); // State to track loading
    const [error, setError] = useState(null); // State to track errors

    // Fetch data using useEffect
    useEffect(() => {
        // Option 1: Using fetch
        fetch("http://localhost:3000/blog")
            .then((response) => response.json())
            .then((data) => {
                setBlogs(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch data");
                setLoading(false);
            });
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <BlogList blogs={blogs} />
        </div>
    );
};

export default Home;
