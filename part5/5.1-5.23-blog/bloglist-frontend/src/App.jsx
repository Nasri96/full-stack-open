import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from "./services/login";
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const blogFormRef = useRef(null);

  const blogsSortedByLikes = blogs.length > 0 && blogs[0].likes === Math.max(...blogs.map(blog => blog.likes));
  console.log(blogsSortedByLikes);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )

    const user = JSON.parse(window.localStorage.getItem("blogAppUser"));
    if(user !== null) {
      setUser(user);
    }
  }, [])

  const handleLogin = async(event) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
      window.localStorage.setItem("blogAppUser", JSON.stringify(response));
      setUser(response);
      setUsername("");
      setPassword("");
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
      blogFormRef.current.toggleVisibility();
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

  const handleSortBlogs = () => {
    // check if blogs are already sorted
    if(blogsSortedByLikes) {
      return blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }


    let sortedBlogs = blogs.map(blog => blog);
    sortedBlogs = sortedBlogs.sort((a, b) => {
      if(a.likes > b.likes) {
        return -1;
      } else if(b.likes > a.likes) {
        return 1;
      } 
      return 0;
    })

    setBlogs(sortedBlogs);
    
  }

  const blogForm = () => {

    return (
      <Togglable buttonName="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>
    )
  }
  

  return (
    <div>
      {error && <p style={{ backgroundColor: '#d1d1d1', color: "#990000", fontSize: "22px", padding: "10px"}}>{error}</p>}
      {success && <p style={{ backgroundColor: '#d1d1d1', color: "#007313", fontSize: "22px", padding: "10px"}}>{success}</p>}
      {user && (
        <>
        <h2>blogs</h2>
        <div>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p> 
        </div>
        {blogForm()}
        <div>
          <button onClick={handleSortBlogs}>{blogsSortedByLikes ? "sort default" : "sort by likes"}</button>
        </div>
        {blogs.map(blog =>
          <Blog 
            key={blog.id} 
            blog={blog} 
            setBlogs={setBlogs} 
            user={user} 
            setError={setError} 
            setSuccess={setSuccess}
          />
        )}
        
        
        </>
      )}
      {!user && (
        <>
        <h2>Login to application</h2>
        <form onSubmit={handleLogin}>
          <label>
            Username: <input type='text' value={username} onChange={event => setUsername(event.target.value)} />
          </label>
          <label>
            Password <input type='password' value={password} onChange={event => setPassword(event.target.value)} />
          </label>
          <button type='submit'>login</button>
        </form>
        </>
      )}
    </div>
  )
}

export default App