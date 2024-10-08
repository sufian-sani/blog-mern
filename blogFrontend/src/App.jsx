import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from "./pages/Home.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar.jsx";
import SignUp from "./pages/Signup.jsx";
import SignIn from "./pages/Signin.jsx";
import Profile from "./pages/Profile.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import BlogEdit from "./pages/BlogEdit.jsx";
import ProfileUpdate from "./pages/ProfileUpdate.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if token exists in localStorage when app loads
        const token = localStorage.getItem("authToken");
        if (token) {
            setIsAuthenticated(true); // If token exists, set authenticated to true
        }
    }, []); // This runs only once when the component mounts

  return (
      <Router>
          <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
              {/*<Route path="/profile" element={<Profile />} />*/}
              <Route path="/blog/:id" element={<BlogDetails />} />
              {isAuthenticated && (
                  <>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/update-password" element={<UpdatePassword />} /> {/* Add update password route */}
                      <Route path="/create-blog" element={<CreateBlog />} />
                      <Route path="/edit-blog/:id" element={<BlogEdit />} /> {/* Add route for editing blog */}
                      <Route path="/update-profile" element={<ProfileUpdate />} />
                  </>
              )}
          </Routes>
      </Router>
  )
}

export default App
