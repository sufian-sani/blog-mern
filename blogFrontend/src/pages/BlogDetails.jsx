import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {formatDate} from "../helper/TimeIssue.js"
import { Link } from "react-router-dom";

const BlogDetails = () => {
    const { id } = useParams(); // Extract blog ID from URL
    const [blog, setBlog] = useState(null); // State to hold blog data
    const [author, setAuthor] = useState(null); // State for author data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors
    const [loggedInUserId, setLoggedInUserId] = useState(null); // State to store logged in user ID
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [comments, setComments] = useState([]); // State to hold comments
    const [newComment, setNewComment] = useState(''); // State for new comment


    const navigate = useNavigate();

    // Function to decode JWT manually (if not using jwt-decode)
    const parseJwt = (token) => {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    };

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                // Fetch the blog data
                const blogResponse = await fetch(`http://localhost:3000/blog/${id}`);
                const blogData = await blogResponse.json();
                setBlog(blogData.data); // Set blog data

                // Fetch the author data using userId from the blog
                const authorResponse = await fetch(`http://localhost:3000/users/author/${blogData.data.userId}`);
                const authorData = await authorResponse.json();
                setAuthor(authorData.data); // Set author data

                const commentsResponse = await fetch(`http://localhost:3000/blog/comment/${id}`);
                const commentsData = await commentsResponse.json();
                setComments(commentsData.data); // Set comments

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch blog or author details");
                setLoading(false);
            }
        };

        fetchBlogData();

        const token = localStorage.getItem("authToken");
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken) {
                setLoggedInUserId(decodedToken.id); // Assuming the userId is stored in the `id` field of the token
            }
        }

    }, [id]);

    const handleDelete = async () => {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

        if (!token) {
            setError("You need to be logged in to delete a blog");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/blog/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            const data = await response.json();

            if (response.ok) {
                alert("Blog deleted successfully!");
                navigate("/"); // Redirect to the home page or blog listing page
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Failed to delete blog post. Please try again.");
        }
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:3000/blog/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blogId: id, userId: loggedInUserId ? loggedInUserId : null }),
            });
            if (!response.ok) {
                throw new Error('Failed to like the blog');
            }
            // Refetch the blog details to update total likes
            const updatedResponse = await fetch(`http://localhost:3000/blog/${id}`);
            const updatedData = await updatedResponse.json();
            setBlog(updatedData.data);
        } catch (err) {
            console.error('Error liking the blog:', err);
        }
    };

    useEffect(()=>{
        const checkLikeStatus = async () => {
            try{
                const response = await fetch(`http://localhost:3000/blog/like-status`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ blogId: id, userId: loggedInUserId ? loggedInUserId : null }),
                });
                const alreadyLikeStatus = await response.json();  // Parse the JSON body
                setAlreadyLiked(alreadyLikeStatus.alreadyLiked); // This will log
            } catch (err){
                console.log('Error fetching like status:', err);
            }
        }
        if (id && loggedInUserId !== null) {
            checkLikeStatus();
        }
    })

    const handleDislike = async () => {
        try {
            const response = await fetch(`http://localhost:3000/blog/dislike`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ blogId: id, userId: loggedInUserId }),
            });
            if (!response.ok) {
                throw new Error('Failed to dislike the blog');
            }
            // Refetch the blog details to update total likes
            const updatedResponse = await fetch(`http://localhost:3000/blog/${id}`);
            const updatedData = await updatedResponse.json();
            setBlog(updatedData.data);
            setAlreadyLiked(false); // Mark as not liked
        } catch (err) {
            console.error('Error disliking the blog:', err);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/blog/comment/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
                body: JSON.stringify({ blogId: id, content: newComment }),
            });
            const result = await response.json();
            // console.log(result.data)

            if (result.success) {
                console.log(result.data);
                setComments([...comments, result.data]); // Add new comment to state
                setNewComment(''); // Clear comment input
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
        }
    };

    if (loading) return <div>Loading...</div>; // Show loading indicator
    if (error) return <div>{error}</div>; // Show error message if any

    console.log(comments)

    return (
        <div>
            {blog ? (
                <>
                    <h1>{blog.title}</h1>
                    <p>{author.name ? `By ${author.name}` : "Author not available"} on {formatDate(blog.createdAt) || "Date not available"}</p>
                    <div>{blog.content}</div>
                    <p>Category: {blog.Category?.name || "Uncategorized"}</p> {/* Display Category */}
                    <p>Likes: {blog.totalLikes}</p>
                    {alreadyLiked ? (
                        <button onClick={handleDislike}>Dislike</button>
                    ) : (
                        <button onClick={handleLike}>Like</button>
                    )}
                    {/*<button onClick={handleLike}>Like</button>*/}
                    {/*<button onClick={handleLike}>*/}
                    {/*    {alreadyLiked ? 'Dislike' : 'Like'}*/}
                    {/*</button>*/}
                    {loggedInUserId === blog.userId && (
                        <>
                            <Link to={`/edit-blog/${blog.id}`}>
                                <button onClick={handleDelete}>Delete Blog</button>
                                {/* Delete button */}
                                <button>Edit Blog</button>
                            </Link>
                        </>
                    )}
                    {/* Render comments */}
                    <h2>Comments:</h2>
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id}>
                                <strong>{comment.users?.name}:</strong> {comment.content}
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                    {/* Comment form, only show if user is logged in */}
                    {loggedInUserId && (
                        <form onSubmit={handleCommentSubmit}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment"
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </>
            ) : (
                <p>No blog details available</p>
            )}
        </div>
    );
};

export default BlogDetails;
