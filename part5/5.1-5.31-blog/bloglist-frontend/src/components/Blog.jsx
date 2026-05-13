import { useState } from "react";
import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Blog = ({ blogs, setBlogs, user, setError, setSuccess }) => {
  const navigate = useNavigate();
  const params = useParams();

  if(blogs.length === 0) {
    return null;
  }
  
  const blog = blogs.find(b => b.id === params.id);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 5
  }

  const handleLike = async() => {
    if(!user) {
      navigate("/login");
      return;
    }

    try {
      const updatedBlog = await blogService.update({ ...blog, likes : blog.likes + 1 });
      setBlogs(prevBlogs => {
        return prevBlogs.map(prevBlog => {
          if(prevBlog.id === updatedBlog.id) {
            return updatedBlog;
          } return prevBlog;
        })
      })
    } catch(error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
    
  }

  const handleRemoveBlog = async(event) => {
    const dialogConfirm = window.confirm(`Remove blog ${blog.title} by ${blog.author} ?`);
    if(!dialogConfirm) {
      return;
    }
    try {
      const response = await blogService.deleteBlog(blog.id, user.token);
      setBlogs(prevBlogs => prevBlogs.filter(prevBlog => prevBlog.id !== blog.id));
      setSuccess(response);
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
      navigate("/blogs");
    } catch(error) {
      console.log(error);
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000)
    }
    
  }

  return (
    <Box className="blog" sx={{ p: 1, pl: 3, mt: 2, boxShadow: 1 }}>
      <Typography component="h3" sx={{ fontWeight: 500, fontSize: 30, mb: 1 }}>{blog.title}</Typography>
      <Typography component="p" sx={{ color: "text.secondary", mb: 1}}>by {blog.author}</Typography>
      <Typography href="#" component="a" sx={{ mb: 1, textDecoration: "underline", color: "primary.main", cursor: "pointer" }}>{blog.url}</Typography>
      <Typography component="p" sx={{ mb: 1, color: "text.secondary"}}>Added by {blog.user.name}</Typography>
      <Typography component="p" sx={{ mb: 1, fontWeight: 400 }}>{blog.likes} likes</Typography>
      <Button color="primary" variant="outlined" sx={{ mb: 1, mr: 1 }} onClick={handleLike}>like</Button>
      {(user && blog.user.username === user.username) && <Button color="error" variant="outlined" sx={{ mb: 1 }} onClick={handleRemoveBlog}>remove</Button>}
    </Box>

  )
}

export default Blog