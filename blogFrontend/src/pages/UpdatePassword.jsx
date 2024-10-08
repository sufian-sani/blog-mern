import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage
        if (!token) {
            setError("You are not logged in");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/users/updatepassword", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    oldPassword: currentPassword,
                    newPassword,
                    confirmPassword

                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message); // Success message
                setError(""); // Clear error
                navigate("/profile");
            } else {
                setError(data.message); // Show error message
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h2>Update Password</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Current Password:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Update Password</button>
                {message && <p style={{ color: "green" }}>{message}</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </div>
    );
};

export default UpdatePassword;
