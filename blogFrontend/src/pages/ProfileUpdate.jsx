import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfileUpdate = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Create a navigate instance

    // Get the auth token (JWT) from localStorage
    const token = localStorage.getItem("authToken");

    // Fetch the current user's profile details on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:3000/users/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setName(data.user.name);
                    setEmail(data.user.email);
                } else {
                    setError(data.message || "Failed to fetch profile");
                }
            } catch (err) {
                setError("Something went wrong");
            }
        };

        fetchProfile();
    }, [token]);

    // Handle form submission for profile update
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/users/update-profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Profile updated successfully");
                setTimeout(() => {
                    navigate("/profile"); // Redirect to the profile page
                }, 1500);
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    return (
        <div>
            <h2>Update Profile</h2>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default ProfileUpdate;
