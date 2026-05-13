import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Link, Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Container, Toolbar, Typography, Alert } from "@mui/material";

import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from "./services/login";
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginPage from './components/pages/LoginPage';
import BlogsPage from './components/pages/BlogsPage';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

    const user = JSON.parse(window.localStorage.getItem("blogAppUser"));
    if(user !== null) {
      setUser(user);
    }
  }, [])

  const handleLogin = async(event, username, password) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
      window.localStorage.setItem("blogAppUser", JSON.stringify(response));
      setUser(response);
    } catch(error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000)
    }
    
  }

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  }

  const handleCreateBlog = async({ title, author, url }) => {
    console.log("creating blog...");
    try {
      const newBlog = await blogService.create({ title, author, url }, user.token);
      setBlogs(blogs.concat(newBlog));
      setSuccess(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setSuccess(null);
      }, 5000)
    } catch(error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }

  

  const padding = {
    padding: 5
  }
  
  return (
    <Container>
      <AppBar position='static'>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Toolbar>
            <Typography variant="h6" component="div">Blog App</Typography>
          </Toolbar>
          <Toolbar>
            <Button color='inherit' to="/blogs" component={Link}>blogs</Button>
            {!user && <Button color='inherit' to="/login" component={Link}>login</Button>}
            {user && (
              <>
                <Button color='inherit' to="/blogs/create" component={Link}>create new blog</Button>
                <Button color='inherit' to="/blogs" onClick={handleLogout} component={Link}>logout</Button>
              </>
            )}
          </Toolbar>
        </Box>
        
      </AppBar>

      {error && <Alert severity='error'>{error}</Alert>}
      {success && <Alert severity='success'>{success}</Alert>}
      
      <Routes>
        <Route 
          path={`/blogs/:id`} 
          element={
            <Blog
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
              setError={setError}
              setSuccess={setSuccess}
            />
          }
        />
        <Route path="/blogs/create" element={<BlogForm createBlog={handleCreateBlog} user={user} />} />
        <Route path="/login" element={<LoginPage onHandleLogin={handleLogin} user={user} />} />
        <Route path="/blogs" element={<BlogsPage blogs={blogs} setBlogs={setBlogs} onCreateBlog={handleCreateBlog} />} />
      </Routes>
    </Container>
  )
}

export default App