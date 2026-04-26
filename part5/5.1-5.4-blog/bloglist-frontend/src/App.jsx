import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  const handleCreate = async(event) => {
    event.preventDefault();
    console.log("creating blog...");
    try {
      const newBlog = await blogService.create({ title: blogTitle, author: blogAuthor, url: blogUrl }, user.token);
      setBlogs(blogs.concat(newBlog));
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      setSuccess(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => {
        setSuccess(null);
      }, 4000)
    } catch(error) {
      setError(error);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }

  return (
    <div>
      {error && <p style={{ backgroundColor: 'gray', color: "red", fontSize: "22px", padding: "10px"}}>{error}</p>}
      {success && <p style={{ backgroundColor: 'gray', color: "green", fontSize: "22px", padding: "10px"}}>{success}</p>}
      {user && (
        <>
        <h2>blogs</h2>
        <div>
          <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p> 
        </div>
        <div>
          <h2>create</h2>
          <form onSubmit={handleCreate}>
            <div>
              <label>
                title
                <input type='text' value={blogTitle} onChange={(event) => setBlogTitle(event.target.value)} />
              </label>
            </div>
            
            <div>
              <label>
                author
                <input type='text' value={blogAuthor} onChange={(event) => setBlogAuthor(event.target.value)} />
              </label>
            </div>

            <div>
              <label>
                url
                <input type='text' value={blogUrl} onChange={(event) => setBlogUrl(event.target.value)} />
              </label>
            </div>
            <button type='submit'>create</button>
          </form>
        </div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
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