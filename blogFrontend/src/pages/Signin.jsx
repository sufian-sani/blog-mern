import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext.jsx'; // Import the context

const SignIn = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { setUser } = useContext(UserContext); // Get setUser from context

    const handleSubmit = async (e) => {
        e.preventDefault();

        // API request payload
        const credentials = {
            email,
            password
        };

        try {
            // Send credentials to your API
            const response = await fetch("http://localhost:3000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });

            const data = await response.json();
            setUser(data.user);

            if (response.ok) {
                // Assuming the token is in data.token
                const token = data.token;

                // Store the token in local storage (or cookies)
                localStorage.setItem("authToken", token);
                localStorage.setItem("userData", JSON.stringify(data.user));
                // localStorage.setItem("userData", data.user);

                // Update the authentication state
                setIsAuthenticated(true);

                // Redirect user to homepage or dashboard after login
                navigate("/");
            } else {
                // Handle error (e.g., invalid credentials)
                setError(data.message || "Failed to login");
            }
        } catch (err) {
            // Handle any other errors
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div>
            <h1>Sign In</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
