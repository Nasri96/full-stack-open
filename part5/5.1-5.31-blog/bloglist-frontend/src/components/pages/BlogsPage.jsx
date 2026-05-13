
import Blog from "../Blog";
import Togglable from "../Togglable";
import BlogForm from "../BlogForm";
import blogService from "../../services/blogs";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const BlogsPage = ({ blogs, setBlogs }) => {
    const blogsSortedByLikes = blogs.length > 0 && blogs[0].likes === Math.max(...blogs.map(blog => blog.likes));

    const handleSortBlogs = () => {
        // check if blogs are already sorted
        if (blogsSortedByLikes) {
            return blogService.getAll().then(blogs =>
                setBlogs(blogs)
            )
        }

        let sortedBlogs = blogs.map(blog => blog);
        sortedBlogs = sortedBlogs.sort((a, b) => {
            if (a.likes > b.likes) {
                return -1;
            } else if (b.likes > a.likes) {
                return 1;
            }
            return 0;
        })

        setBlogs(sortedBlogs);

    }

    return (
        <div>
            <h2>blogs</h2>
            {/* {blogForm()} */}
            <div>
                <Button color="secondary" onClick={handleSortBlogs} variant="contained">{blogsSortedByLikes ? "sort default" : "sort by likes"}</Button>
            </div>
            <ul>
                {blogs.map(blog =>
                    <li key={blog.id}><Link to={`/blogs/${blog.id}`}>{blog.title}</Link></li>
                )}
            </ul>
            
        </div>
    )
}

export default BlogsPage;