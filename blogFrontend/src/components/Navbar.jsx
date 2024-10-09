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
        localStorage.removeItem("userData"); // Remove token
        setUser(null);
        setIsAuthenticated(false); // Set authentication state to false
        navigate("/signin"); // Redirect to the sign-in page
    };

    // useEffect(() => {
    //     const checkSession = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/users/session-check', {
    //                 // method: 'GET',
    //                 // credentials: 'include',
    //                 // headers: {
    //                 //     'Content-Type': 'application/json',
    //                 // },
    //             });
    //
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 console.log('data', data);
    //                 setUser(data.user); // Set user data if session exists
    //             } else {
    //                 console.error('Error fetching session:', response.status);
    //             }
    //         } catch (error) {
    //             console.error('Error fetching session:', error);
    //         }
    //     };
    //
    //     checkSession();
    // }, []);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // const response = await fetch(`http://localhost:3000/users/session-check`);
    //             // const blogData = await response.json();
    //             // console.log(blogData)
    //             // setBlog(blogData.data); // Set blog data
    //             // const response = await fetch('http://localhost:3000/users/session-check', {
    //             //     method: 'GET', // Or 'POST' if needed
    //             //     headers: {
    //             //         'Content-Type': 'application/json',
    //             //         // 'Cookie': document.cookie // If your session relies on cookies
    //             //     },
    //             //     credentials: 'include', // This is crucial if your session relies on cookies
    //             // });
    //             //
    //             // if (!response.ok) {
    //             //     throw new Error('Network response was not ok');
    //             // }
    //             //
    //             // const data = await response.json();
    //             // console.log(data); // Do something with your data
    //             fetch('http://localhost:3000/users/session-check', {
    //                 method: 'GET', // Or 'POST' if needed
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 credentials: 'include' // This will include cookies with your request
    //             })
    //                 .then(response => {
    //                     if (!response.ok) {
    //                         throw new Error('Network response was not ok');
    //                     }
    //                     return response.json();
    //                 })
    //                 .then(data => {
    //                     console.log(data); // Handle the response data
    //                 })
    //                 .catch(error => {
    //                     console.error('Fetch error:', error);
    //                 });
    //         } catch (error) {
    //             console.error('Fetch error:', error);
    //         }
    //     };
    //
    //     fetchData();
    // }, []); // Add necessary dependencies if required
    // console.log(user)
    // localStorage.setItem("userData", user);
    let storedValue = localStorage.getItem('userData');
    if (storedValue) {
        storedValue = JSON.parse(storedValue)
    }

    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {isAuthenticated ? (
                    <>
                        <li>
                            {/*<Link to="/profile">Name: {user?.name}</Link> /!* Profile link for logged-in users *!/*/}
                            <Link to="/profile">Name: {user ? user.name : storedValue.name}</Link> {/* Profile link for logged-in users */}
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
