import { useState } from "react";
import Togglable from "./Togglable";
import blogService from "../services/blogs";

const Blog = ({ blog, setBlogs, user, setError, setSuccess }) => {
  console.log(blog);
  console.log(blog.user.username, user.username);
  const [blogDetailsShown, setBlogDetailsShown] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDetailsShown = () => {
    setBlogDetailsShown(!blogDetailsShown);
  }

  const handleLike = async() => {
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
    } catch(error) {
      console.log(error);
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000)
    }
    
  }

  return (
    <>
      {blogDetailsShown && (
        <div style={blogStyle}>
          <p>{blog.title} <button onClick={handleDetailsShown}>hide</button></p>
          <p>{blog.url}</p>
          <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.author}</p>
          {blog.user.username === user.username && <button onClick={handleRemoveBlog}>remove</button>}
          
        </div>
      )} 
      {!blogDetailsShown && (
        <div style={blogStyle}>
          {blog.title} {blog.author} <button onClick={handleDetailsShown}>view</button>
        </div> 
      )}
    </>
  )
}

export default Blog