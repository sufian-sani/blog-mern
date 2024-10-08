import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState(""); // Add state for name
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic password match validation
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const newUser = {
            name, // Include name in request
            email,
            password,
        };

        try {
            const response = await fetch("http://localhost:3000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (response.ok) {
                // If signup is successful, redirect to sign-in page
                navigate("/signin");
            } else {
                setError(data.message || "Signup failed");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSignUp}>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <label>Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
