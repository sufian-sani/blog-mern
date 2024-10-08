import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null); // State to store user profile
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user profile from API, assuming token is stored in localStorage
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("You need to be logged in to view your profile");
            setLoading(false);
            return;
        }

        fetch("http://localhost:3000/users/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data.user); // Assuming API returns user data
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to fetch user profile");
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>User Type:</strong> {user.role}</p>
                    <samp>
                        <Link to="/update-password">Update Password</Link> {/* Link to update password */}
                        <br/>
                        <Link to="/update-profile">Update Profile</Link>
                    </samp>

                </div>
            ) : (
                <p>No user profile available</p>
            )}
        </div>
    );
};

export default Profile;
