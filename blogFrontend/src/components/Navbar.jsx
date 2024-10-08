import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assume you're using react-router for navigation
import { UserContext } from '../context/UserContext.jsx'

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
    const { user, setUser } = useContext(UserContext);
    // const [isAuthenticated, setIsAuthenticated] = useState(
    //     !!localStorage.getItem("authToken") // Check if there's a token to initialize the state
    // ); // Authentication state
    const navigate = useNavigate();

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token
        setUser(null);
        setIsAuthenticated(false); // Set authentication state to false
        navigate("/signin"); // Redirect to the sign-in page
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                fetch('http://localhost:3000/users/session-check', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => console.log('data',data))
                    .catch(error => console.error('Error:', error));
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };
        checkSession()
    }, [setUser]);

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/profile">Name: {user?.name}</Link> {/* Profile link for logged-in users */}
                        </li>
                        <li>
                            <Link to="/create-blog">Create Blog</Link> {/* Add link to create blog */}
                        </li>
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/signup">Sign Up</Link>
                        </li>
                        <li>
                            <Link to="/signin">Sign In</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
