import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [blogTitle, setBlogTitle] = useState("");
    const [blogAuthor, setBlogAuthor] = useState("");
    const [blogUrl, setBlogUrl] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        createBlog({ title: blogTitle, author: blogAuthor, url: blogUrl });
        setBlogTitle("");
        setBlogAuthor("");
        setBlogUrl("");
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={handleSubmit}>
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
        </>
        
    )
}

export default BlogForm;