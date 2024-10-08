// UserContext.jsx
import React, { createContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initial state for user

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
